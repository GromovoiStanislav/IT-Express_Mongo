import {Router, Request, Response, NextFunction} from 'express'
import {Posts} from '../repositories/posts'
import {auth} from "../middlewares/authorization";
import {body} from 'express-validator';
import {inputValidation} from '../middlewares/input-validation'
import {Blogs} from "../repositories/blogs";

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

const validator = [
    body('title').notEmpty().trim().isLength({max: 30}),
    body('shortDescription').notEmpty().trim().isLength({max: 100}),
    body('content').notEmpty().trim().isLength({max: 1000}),
    body('blogId').notEmpty(),
]

router.post('/', auth, validator, inputValidation, (req: Request, res: Response) => {
    const data = {
        title: req.body.title.trim(),
        shortDescription: req.body.shortDescription.trim(),
        content: req.body.content.trim(),
        blogId: req.body.blogId.trim(),
    }
    res.status(201).send(Posts.createNewPost(data))
})


router.put('/:id', auth, validator, inputValidation, (req: Request, res: Response) => {
    const data = {
        title: req.body.title.trim(),
        shortDescription: req.body.shortDescription.trim(),
        content: req.body.content.trim(),
        blogId: req.body.blogId.trim(),
    }

    if (Posts.updatePost(req.params.id, data)) {
        res.send(204)
    } else {
        res.send(404)
    }

})




export const clearAllPosts = () => {
    Posts.clearAll()
}

export default router