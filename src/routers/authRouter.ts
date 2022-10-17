import {Router, Request, Response} from 'express'
import {body, CustomValidator} from "express-validator";
import {inputValidation} from "../middlewares/input-validation";
import {UserInputModel} from "../types/users";
import {UsersService} from "../domain/users-services";
import {authJWT} from "../middlewares/authorization";
import {Users} from "../repositories/users";



const router = Router();

const isLoginExistAlready : CustomValidator = async (value) => {
    const userExist = await Users.getUserByLogin(value)
    if(userExist){ throw new Error('login already exist');}
    return true;
}
const isEmailExistAlready : CustomValidator = async (value) => {
    const userExist = await Users.getUserByEmail(value)
    if(userExist){ throw new Error('email already exist');}
    return true;
}
const validatorRegistration = [
    body('login').trim().notEmpty().isString().isLength({min:3, max: 10}).custom(isLoginExistAlready),
    body('password').trim().notEmpty().isString().isLength({min:6, max: 20}),
    body('email').trim().notEmpty().isString().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).custom(isEmailExistAlready),
]
router.post('/registration', validatorRegistration, inputValidation, async (req: Request, res: Response) => {

    const dataUser:UserInputModel = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
    }
    await UsersService.registerUser(dataUser)
    res.sendStatus(204)
})




const validatorLogin = [
    body('login').trim().notEmpty(),
    body('password').trim().notEmpty(),
]

router.post('/login', validatorLogin, inputValidation, async (req: Request, res: Response) => {

    const JWTAccessToken = await UsersService.loginUser(req.body.login, req.body.password)
    if (!JWTAccessToken) {
        return res.sendStatus(401)
    }
    res.status(200).send({accessToken: JWTAccessToken})

})

router.get('/me', authJWT, async (req: Request, res: Response) => {

    res.status(200).send({
        "email": req.user!.email,
        "login": req.user!.login,
        "userId": req.user!.id,
    })

})


export default router