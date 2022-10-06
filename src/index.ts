import express, { Request, Response,NextFunction} from 'express'
import {runDB} from './repositories/db'

import blogsRouter,{clearAllBlogs} from './routers/blogsRouter'
import postsRouter,{clearAllPosts} from './routers/postsRouter'
import {emailAdapter} from "./adapters/email-adapter";

export const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());

app.use('/blogs',blogsRouter)
app.use('/posts',postsRouter)

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await clearAllBlogs()
    await clearAllPosts()
    res.sendStatus(204)
})

app.post('/email/send',async (req: Request, res: Response) => {
    let info = await emailAdapter.sendEmail(req.body.email,req.body.subject,req.body.message)
    res.sendStatus(204)
})

app.use((req:Request, res:Response,next:NextFunction) => {
    res.sendStatus(404)
})

app.use((err:any,req:Request, res:Response,next:NextFunction) => {
    res.sendStatus(500)
})


const startApp = async ():Promise<void> => {
    await runDB()
    app.listen(PORT, () => {
        console.log(`Example app listening on port http://localhost:${PORT}/`)
    })
}

startApp();

