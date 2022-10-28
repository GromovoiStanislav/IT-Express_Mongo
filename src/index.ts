import express, {Request, Response, NextFunction} from 'express'
import cookieParser from 'cookie-parser'
import {runDB} from './repositories/db'

import testingRouter  from './routers/testingRouter'
import blogsRouter from './routers/blogsRouter'
import postsRouter from './routers/postsRouter'
import usersRouter from './routers/usersRouter'
import commentsRouter from './routers/commentsRouter'
import authRouter from './routers/authRouter'
import securityRouter from './routers/securityRouter'



export const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cookieParser())
app.set('trust proxy', true)

app.use('/testing', testingRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/auth', authRouter)
app.use('/security', securityRouter)




app.use((req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404)
})



const startApp = async (): Promise<void> => {
    await runDB()
    app.listen(PORT, () => {
        console.log(`Example app listening on port http://localhost:${PORT}/`)
    })
}
startApp();
