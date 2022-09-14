import express ,{Request, Response} from 'express'
import videosRouter,{clearAllVideos} from './routers/videosRouter'


const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json());

app.use('/videos',videosRouter)


app.delete('/testing/all-data', (req:Request, res:Response) => {
    clearAllVideos()
    res.send(204)
})



app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}/`)
})
//https://it-students-demo.herokuapp.com/