import express, { Request, Response,NextFunction} from 'express'
import {runDB} from './repositories/db'
import videosRouter,{clearAllVideos} from './routers/videosRouter'
import blogsRouter,{clearAllBlogs} from './routers/blogsRouter'
import postsRouter,{clearAllPosts} from './routers/postsRouter'


const app = express()
const PORT = process.env.PORT || 3000



app.use(express.json());

app.use('/videos',videosRouter)
app.use('/blogs',blogsRouter)
app.use('/posts',postsRouter)


app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await clearAllVideos()
    await clearAllBlogs()
    await clearAllPosts()
    res.send(204)
})

app.use((req:Request, res:Response,next:NextFunction) => {
    res.send(404)
})

app.use((err:any,req:Request, res:Response,next:NextFunction) => {
    res.send(500)
})



const startApp = async ():Promise<void> => {
    await runDB()
    app.listen(PORT, () => {
        console.log(`Example app listening on port http://localhost:${PORT}/`)
    })
}

startApp();

//https://it-students-demo.herokuapp.com/