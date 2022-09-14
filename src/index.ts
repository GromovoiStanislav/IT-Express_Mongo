import express ,{Request, Response} from 'express'
import videosRouter,{clearAllVideos} from './routers/videosRouter'


const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json());

app.use('/ht_01/api/videos',videosRouter)


app.delete('/ht_01/api/testing/all-data', (req:Request, res:Response) => {
    clearAllVideos()
    res.send(204)
})



app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}/`)
})
//https://it-students-demo.herokuapp.com/