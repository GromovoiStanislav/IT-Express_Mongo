import {Router, Request, Response, NextFunction} from 'express'
import {PostsService} from '../domain/posts-services'
import {BlogsService} from '../domain/blogs-services'
import {auth} from "../middlewares/authorization";
import {body, CustomValidator} from 'express-validator';
import {inputValidation} from '../middlewares/input-validation'


const router = Router();


router.get('/', async (req: Request, res: Response) => {
    const result = await PostsService.getAll()
    res.send(result)
})

router.get('/:id', async (req: Request, res: Response) => {
    const item = await PostsService.findByID(req.params.id)
    if (item) {
        res.send(item)
    } else {
        res.sendStatus(404)
    }
})

router.delete('/:id', auth, async (req: Request, res: Response) => {
    if (await PostsService.deleteByID(req.params.id)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
const isValidBlogId: CustomValidator = async (value) => {
    const currentBlog = await BlogsService.findByID(value)
    if (!currentBlog) {
        throw new Error('wrong blogId');
    }
    return true;
}
const validator = [
    body('title').trim().notEmpty().isString().isLength({max: 30}),
    body('shortDescription').trim().isString().notEmpty().isLength({max: 100}),
    body('content').trim().notEmpty().isString().isLength({max: 1000}),
    body('blogId').trim().notEmpty().isString().custom(isValidBlogId),
]


router.post('/', auth, validator, inputValidation, async (req: Request, res: Response) => {
    const data = {
        title: req.body.title.trim(),
        shortDescription: req.body.shortDescription.trim(),
        content: req.body.content.trim(),
        blogId: req.body.blogId.trim(),
    }
    const result = await PostsService.createNewPost(data)
    res.status(201).send(result)
})


router.put('/:id', auth, validator, inputValidation, async (req: Request, res: Response) => {
    const data = {
        title: req.body.title.trim(),
        shortDescription: req.body.shortDescription.trim(),
        content: req.body.content.trim(),
        blogId: req.body.blogId.trim(),
    }

    if (await PostsService.updatePost(req.params.id, data)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

})


export const clearAllPosts = async () => {
    await PostsService.clearAll()
}

export default router