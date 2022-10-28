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


    add(ip: string, endpoint: string, date: number): void {
        this.store.push({ip, endpoint, date})
    }

    stop(ip: string, endpoint: string): boolean {
        const date = Date.now()
        const dateN = date - this.resetIn * 1000

        this.add(ip, endpoint, date)

        const tempArr = this.store.filter(el => {
            return (el.endpoint === endpoint && el.ip === ip && el.date >= dateN)
        })

        return tempArr.length === this.numRequests
    }

}