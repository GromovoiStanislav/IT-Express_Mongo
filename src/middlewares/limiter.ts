import {Request, Response, NextFunction} from 'express'

import rateLimit, {MemoryStore} from 'express-rate-limit'
import {jwtService} from "../aplicarion/jwt-service";
import {UsersService} from "../domain/users-services";

export const limiter = (numRequests: number, resetIn: number) => rateLimit({
        windowMs: resetIn,
        max: numRequests,
        legacyHeaders: false,
        standardHeaders: false,
        //store: new MemoryStore(),
    }
)

//////////////////////////////////////////////////////////////////////////
type ElType = { ip: string, url: string, date: number }

export class MyLimiter {
    protected store: ElType[] = []

    constructor(
        protected numRequests: number,
        protected resetIn: number,
    ) {
    }

    rateLimit(ip: string, url: string): boolean {
        const date = Date.now()
        const dateN = date - this.resetIn * 1000

        /// Удаляем старые записи
        this.store = this.store.filter(el => {
            return (el.date >= dateN)
        })
        //Добавляем текущий вызов
        this.store.push({ip, url, date})

        //Считаем
        const tempArr = this.store.filter(el => {
            return (el.url === url && el.ip === ip && el.date >= dateN)
        })
        //Решаем
        return tempArr.length > this.numRequests
    }
}

/////////////////////////////////////////////////
let store: ElType[] = []

export const MyLimiter2 = (numRequests: number, resetIn: number) => (req: Request, res: Response, next: NextFunction) => {
    const date = Date.now()
    const dateN = date - resetIn * 1000

    /// Удаляем старые записи
    store = store.filter(el => {
        return (el.date >= dateN)
    })
    //Добавляем текущий вызов
    store.push({ip: req.ip, url: req.url, date})


    //Считаем
    const tempArr = store.filter(el => {
        return (el.url === req.url && el.ip === req.ip && el.date >= dateN)
    })
    //Решаем
    if (tempArr.length > numRequests) {
        return res.sendStatus(429)
    }

    next()

}