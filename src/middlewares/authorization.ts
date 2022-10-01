import {Request, Response, NextFunction} from 'express'


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

