import {NextFunction, Request, Response} from 'express'
import {jwtService} from '../aplication/jwt-service'
import {UsersQuery} from '../domain/users-services'


export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    if (!token) {
        return res.sendStatus(401)
    }
    if (token !== 'Basic YWRtaW46cXdlcnR5') {
        return res.sendStatus(401)
    }
    next()
}

export const authJWT = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.header('Authorization')) {
        return res.sendStatus(401)
    }

    const token = req.header('Authorization')?.split(' ')[1] as string
    const userId = await jwtService.getUserIdByToken(token)
    if(userId){
        req.user = await UsersQuery.findUserById(userId)
        next()
        return
    }

    res.sendStatus(401)
}

export const userIdFromJWT = async (req: Request, res: Response, next: NextFunction) => {

    if (req.header('Authorization')) {
        const token = req.header('Authorization')?.split(' ')[1] as string
        req.userId = await jwtService.getUserIdByToken(token) || void 0
    }

    next()
}