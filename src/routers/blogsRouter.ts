import {Router, Request, Response} from 'express'
import {BlogsService,BlogsQuery} from '../domain/blogs-services'
import {PostsService,PostsQuery} from '../domain/posts-services'
import {auth, userIdFromJWT} from "../middlewares/authorization";
import {body,query} from 'express-validator';
import {paginationQuerySanitizer,inputValidation,paginationParams} from '../middlewares/input-validation'
import {PostInputModel} from "../types/posts";


const router = Router();


const paginationSanitizer =[
    ...paginationQuerySanitizer,
    query('searchNameTerm').escape().trim().default(''),
]

router.get('/', paginationSanitizer, async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm as string

    const paginationParams: paginationParams = {
        pageNumber: Number(req.query.pageNumber),
        pageSize: Number(req.query.pageSize),
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as string,
    }

    const result = await BlogsQuery.getAll(searchNameTerm,paginationParams)
    res.send(result)
})

router.get('/:id', async (req: Request, res: Response) => {
    const item = await BlogsQuery.findByID(req.params.id)
    if (item) {
        res.send(item)
    } else {
        res.sendStatus(404)
    }
})


router.get('/:blogId/posts',paginationQuerySanitizer, userIdFromJWT, async (req: Request, res: Response) => {

    const paginationParams: paginationParams = {
        pageNumber: Number(req.query.pageNumber),
        pageSize: Number(req.query.pageSize),
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as string,
    }

    const result = await PostsQuery.findPostByBlogID(req.params.blogId,paginationParams, req!.userId)
    if (result) {
        res.send(result)
    } else {
        res.sendStatus(404)
    }
})

const postsValidator = [
    body('title').trim().notEmpty().isString().isLength({max: 30}),
    body('shortDescription').trim().isString().notEmpty().isLength({max: 100}),
    body('content').trim().notEmpty().isString().isLength({max: 1000}),
]

router.post('/:blogId/posts', auth, postsValidator, inputValidation, async (req: Request, res: Response) => {

    const data:PostInputModel = {
        title: req.body.title.trim(),
        shortDescription: req.body.shortDescription.trim(),
        content: req.body.content.trim(),
        blogId: req.params.blogId,
    }

    const result = await PostsService.createNewPostByBlogID(data)
    if (result) {
        res.status(201).send(result)
    } else {
        res.sendStatus(404)
    }
})


router.delete('/:id', auth, async (req: Request, res: Response) => {
    const result = await BlogsService.deleteByID(req.params.id)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})


//const regex = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
const regex:RegExp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/
const validator = [
    body('name').trim().notEmpty().isString().isLength({max: 15}),
    body('youtubeUrl').trim().notEmpty().isString().isLength({max: 100}).matches(regex),
]


router.post('/', auth, validator, inputValidation, async (req: Request, res: Response) => {
    const data = {
        name: req.body.name.trim(),
        youtubeUrl: req.body.youtubeUrl.trim()
    }
    const result = await BlogsService.createNewBlog(data)
    res.status(201).send(result)
})

router.put('/:id', auth, validator, inputValidation, async(req: Request, res: Response) => {
    const data = {
        name: req.body.name.trim(),
        youtubeUrl: req.body.youtubeUrl.trim()
    }

    const result = await BlogsService.updateBlog(req.params.id, data)
    if (result) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

})


export const clearAllBlogs = async () => {
    await BlogsService.clearAll()
}

export default router