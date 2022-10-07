import {Router, Request, Response} from 'express'
import {body} from "express-validator";
import {inputValidation} from "../middlewares/input-validation";
import {LoginInputModel} from "../types/auth";
import {UsersService} from "../domain/users-services";


const router = Router();

const validator = [
    body('login').trim().notEmpty(),
    body('password').trim().notEmpty(),
]

router.post('/login', validator, inputValidation, async (req: Request, res: Response) => {

    const result = await UsersService.loginUser(req.body.login, req.body.password)
    if (result) {
        return res.sendStatus(204)
    } else {
        return res.sendStatus(401)
    }

})

export default router