import {Request, Response, NextFunction} from 'express'


type ElType = {
    ip: string
    url: string
    date: number
}

let store: ElType[] = []

export const MyLimiter = (numRequests: number, resetIn: number) => (req: Request, res: Response, next: NextFunction) => {
    const date = Date.now()
    const dateN = date - resetIn * 1000

    /// Удаляем старые записи
    store = store.filter(el => {
        return (el.date >= dateN)
    })
    //Добавляем текущий вызов
    store.push({ip: req.ip, url: req.originalUrl , date})

    //Считаем
    const tempArr = store.filter(el => {
        return (el.url === req.originalUrl && el.ip === req.ip && el.date >= dateN)
    })
    //Решаем
    if (tempArr.length > numRequests) {
        return res.sendStatus(429)
    }

    next()

}