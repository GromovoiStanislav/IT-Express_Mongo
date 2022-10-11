import {Router, Request, Response} from 'express'
import {body} from "express-validator";
import {inputValidation} from "../middlewares/input-validation";
import {LoginInputModel} from "../types/auth";
import {UsersService} from "../domain/users-services";
import {authJWT} from "../middlewares/authorization";


const router = Router();

const validator = [
    body('login').trim().notEmpty(),
    body('password').trim().notEmpty(),
]

router.post('/login', validator, inputValidation, async (req: Request, res: Response) => {

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