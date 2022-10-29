import {Router, Request, Response} from 'express'
import {body, CustomValidator} from "express-validator";
import {inputValidation} from "../middlewares/input-validation";
import {UserInputModel} from "../types/users";
import {UsersService} from "../domain/users-services";
import {authJWT} from "../middlewares/authorization";
import {Users} from "../repositories/users";
import {MyLimiter} from "../middlewares/limiter";
// import {limiter} from "../middlewares/limiter";
// const authLimiter = limiter(5, 1000 * 10)//10sec



const router = Router();
const myLimiter = new MyLimiter(5, 10)


////////////////////////////// registration //////////////////////////////////////////////
const isLoginExistAlready: CustomValidator = async (value) => {
    const userExist = await Users.getUserByLogin(value)
    if (userExist) {
        throw new Error('login already exist')
    }
    return true;
}
const isEmailExistAlready: CustomValidator = async (value) => {
    const userExist = await Users.getUserByEmail(value)
    if (userExist) {
        throw new Error('email already exist')
    }
    return true;
}
const validatorRegistration = [
    body('login').trim().notEmpty().isString().isLength({min: 3, max: 10}).custom(isLoginExistAlready),
    body('password').trim().notEmpty().isString().isLength({min: 6, max: 20}),
    body('email').trim().notEmpty().isString().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(isEmailExistAlready),
]
router.post('/registration', validatorRegistration, inputValidation, async (req: Request, res: Response) => {

    if (myLimiter.rateLimit(req.ip, '/registration')) {
        return res.sendStatus(429)
    }

    const dataUser: UserInputModel = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
    }
    await UsersService.registerUser(dataUser)
    res.sendStatus(204)
})


////////////////////////////// registration-confirmation //////////////////////////////////////////////
// const isConfirmedAlready: CustomValidator = async (value) => {
//     const userExist = await Users.getUserByConfirmationCode(value)
//     if (!userExist) {
//         throw new Error('Confirmation code is incorrect')
//     }
//     if (userExist.emailConfirmation?.isConfirmed) {
//         throw new Error('Account already was activated')
//     }
//     return true;
// }
const validatorConfirmation = [
    body('code').trim().notEmpty().isString(),
]
router.post('/registration-confirmation', validatorConfirmation, inputValidation, async (req: Request, res: Response) => {

    if (myLimiter.rateLimit(req.ip, '/registration-confirmation')) {
        return res.sendStatus(429)
    }

    const result = await UsersService.confirmEmail(req.body.code)
    if (result) {
        return res.sendStatus(204)
    }

    res.status(400).send({
        errorsMessages: [
            {
                message: 'Confirmation code is incorrect',
                field: "code"
            }
        ]
    })
})


////////////////////////////// registration-email-resending /////////////////////////
const isEmailAlreadyConfirmed: CustomValidator = async (value) => {
    const user = await Users.getUserByEmail(value)
    if (!user) {
        throw new Error('email is incorrect')
    }
    if (user.emailConfirmation?.isConfirmed) {
        throw new Error('email is already confirmed')
    }
    return true;
}
const validatorEmailResending = [
    body('email').trim().notEmpty().isString().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(isEmailAlreadyConfirmed),
]
router.post('/registration-email-resending', validatorEmailResending, inputValidation, async (req: Request, res: Response) => {

    if (myLimiter.rateLimit(req.ip, '/registration-email-resending')) {
        return res.sendStatus(429)
    }

    await UsersService.resendConfirmationCode(req.body.email)
    res.sendStatus(204)
})


////////////////////////////// login //////////////////////////////////////////////
const validatorLogin = [
    body('login').trim().notEmpty(),
    body('password').trim().notEmpty(),
]
router.post('/login', validatorLogin, inputValidation, async (req: Request, res: Response) => {

    if (myLimiter.rateLimit(req.ip, '/login')) {
        return res.sendStatus(429)
    }

    let title = req.header('user-agent') ?? ''
    title = title.split(' ')[0]

    const JWT_Tokens = await UsersService.loginUser(req.body.login, req.body.password, req.ip, title)
    if (!JWT_Tokens) {
        return res.sendStatus(401)
    }
    res.cookie('refreshToken', JWT_Tokens.refreshToken, {
        maxAge: 1000 * 20,
        httpOnly: true,
        secure: true,
    })
    res.status(200).send({accessToken: JWT_Tokens.accessToken})
})


////////////////////////////// logout //////////////////////////////////////////////
router.post('/logout', async (req: Request, res: Response) => {
    const isOK = await UsersService.logoutUser(req.cookies.refreshToken)
    if (isOK) {
        return res.sendStatus(204)
    }
    res.sendStatus(401)
})


////////////////////////////// logout //////////////////////////////////////////////
router.post('/refresh-token', async (req: Request, res: Response) => {
    let title = req.header('user-agent') ?? ''
    title = title.split(' ')[0]

    const JWT_Tokens = await UsersService.refreshToken(req.cookies.refreshToken, req.ip, title)
    if (!JWT_Tokens) {
        return res.sendStatus(401)
    }
    res.cookie('refreshToken', JWT_Tokens.refreshToken, {
        maxAge: 1000 * 20,
        httpOnly: true,
        secure: true,
    })
    res.status(200).send({accessToken: JWT_Tokens.accessToken})
})


////////////////////////////// me //////////////////////////////////////////////
router.get('/me', authJWT, async (req: Request, res: Response) => {

    res.status(200).send({
        "email": req.user!.email,
        "login": req.user!.login,
        "userId": req.user!.id,
    })
})


export default router