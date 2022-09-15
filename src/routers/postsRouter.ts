import {Router, Request, Response} from 'express'
import {Posts} from '../repositories/posts'
import {auth} from "../middlewares/authorization";
import { body, validationResult } from 'express-validator';

const router = Router();


router.get('/', (req: Request, res: Response) => {
    res.send(Posts.getAll())
})

router.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        res.send(400)
        return
    }


    const item = Posts.findByID(id)
    if (item) {
        res.send(item)
    } else {
        res.send(404)
    }
})

router.delete('/:id', auth,(req: Request, res: Response) => {
    if (Posts.deleteByID(req.params.id)) {
        res.send(204)
    } else {
        res.send(404)
    }
})




export const clearAllPosts = () => {
    Posts.clearAll()
}

export default router