import express, {NextFunction, Request, Response} from 'express'
import videosRouter,{clearAllVideos} from './routers/videosRouter'
import blogsRouter,{clearAllBlogs} from './routers/blogsRouter'
import postsRouter,{clearAllPosts} from './routers/postsRouter'


const app = express()
const PORT = process.env.PORT || 3000



app.use(express.json());

app.use('/videos',videosRouter)
app.use('/blogs',blogsRouter)
app.use('/posts',postsRouter)


app.delete('/testing/all-data', (req:Request, res:Response) => {
    clearAllVideos()
    clearAllBlogs()
    clearAllPosts()
    res.send(204)
})

app.use((req:Request, res:Response) => {
    res.send(404)
})



app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}/`)
})
//https://it-students-demo.herokuapp.com/