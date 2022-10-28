import rateLimit, {MemoryStore} from 'express-rate-limit'

export const limiter = (numRequests: number, resetIn: number) => rateLimit({
        windowMs: resetIn,
        max: numRequests,
        legacyHeaders: false,
        standardHeaders: false,
        //store: new MemoryStore(),
    }
)