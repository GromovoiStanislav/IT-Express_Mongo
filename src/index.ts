import express, {Request, Response} from 'express'
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req:Request, res:Response) => {
    let message = 'Hello Incubator!!!!!';
    res.send(message)
})

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}/`)
})
//https://it-students-demo.herokuapp.com/