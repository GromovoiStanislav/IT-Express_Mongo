import {Request, Response, NextFunction} from 'express'

import rateLimit, {MemoryStore} from 'express-rate-limit'

export const limiter = (numRequests: number, resetIn: number) => rateLimit({
        windowMs: resetIn,
        max: numRequests,
        legacyHeaders: false,
        standardHeaders: false,
        store: new MemoryStore(),
    }
)


type ElType = { ip: string, endpoint: string, date: number }


export class MyLimiter {
    protected store: ElType[] = []

    constructor(
        protected numRequests: number,
        protected resetIn: number,
    ) {}

    rateLimit(ip: string, endpoint: string): boolean {
        const date = Date.now()
        const dateN = date - this.resetIn * 1000

        /// Удаляем старые записи
        this.store = this.store.filter(el => {
            return (el.date >= dateN)
        })
        //Добавляем текущий вызов
        this.store.push({ip, endpoint, date})

        //Считаем
        const tempArr = this.store.filter(el => {
            return (el.endpoint === endpoint && el.ip === ip && el.date >= dateN)
        })
        //Решаем
        return tempArr.length > this.numRequests
    }

}