import express, {Request, Response, NextFunction} from 'express'
import cookieParser from 'cookie-parser'
import {runDB} from './repositories/db'

import blogsRouter, {clearAllBlogs} from './routers/blogsRouter'
import postsRouter, {clearAllPosts} from './routers/postsRouter'
import usersRouter, {clearAllUsers} from './routers/usersRouter'
import commentsRouter, {clearAllComments} from './routers/commentsRouter'

import authRouter from './routers/authRouter'

import {emailAdapter} from "./adapters/email-adapter";

export const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cookieParser())
app.set('trust proxy', true)

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/auth', authRouter)


app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await clearAllBlogs()
    await clearAllPosts()
    await clearAllUsers()
    await clearAllComments()
    res.sendStatus(204)
})


app.use((req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(404)
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(500)
})


const startApp = async (): Promise<void> => {
    await runDB()
    app.listen(PORT, () => {
        console.log(`Example app listening on port http://localhost:${PORT}/`)
    })
}

startApp();
