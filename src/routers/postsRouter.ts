import {Router, Request, Response} from 'express'
import {PostsService, PostsQuery} from '../domain/posts-services'
import {BlogsQuery} from '../domain/blogs-services'
import {auth, authJWT, userIdFromJWT} from "../middlewares/authorization";
import {body, CustomValidator} from 'express-validator';
import {paginationQuerySanitizer, inputValidation, paginationParams} from '../middlewares/input-validation'
import {CommentsQuery, CommentsService} from "../domain/comments-services";
import {CommentInputModel} from "../types/comments";

const router = Router();


/////////////////////////////////////////////////
router.get('/', paginationQuerySanitizer, async (req: Request, res: Response) => {

    const paginationParams: paginationParams = {
        pageNumber: Number(req.query.pageNumber),
        pageSize: Number(req.query.pageSize),
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as string,
    }

    const result = await PostsQuery.getAll(paginationParams)
    res.send(result)
})


/////////////////////////////////////////////////
router.get('/:id', async (req: Request, res: Response) => {
    const item = await PostsQuery.findByID(req.params.id)
    if (item) {
        res.send(item)
    } else {
        res.sendStatus(404)
    }
})


/////////////////////////////////////////////////
router.delete('/:id', auth, async (req: Request, res: Response) => {
    if (await PostsService.deleteByID(req.params.id)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})


/////////////////////////////////////////////////
const isValidBlogId: CustomValidator = async (value) => {
    const currentBlog = await BlogsQuery.findByID(value)
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


/////////////////////////////////////////////////
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


/////////////////////////////////////////////////
router.get('/:postId/comments', paginationQuerySanitizer, userIdFromJWT, async (req: Request, res: Response) => {

    const isFind = await PostsQuery.findByID(req.params.postId)
    if (!isFind) {
        return res.sendStatus(404)
    }

    const paginationParams: paginationParams = {
        pageNumber: Number(req.query.pageNumber),
        pageSize: Number(req.query.pageSize),
        sortBy: req.query.sortBy as string,
        sortDirection: req.query.sortDirection as string,
    }

    const item = await CommentsQuery.findAllByPostId(req.params.postId, paginationParams, req!.userId)
    if (item) {
        res.send(item)
    } else {
        res.sendStatus(404)
    }
})


/////////////////////////////////////////////////
const CommentsValidator = [
    body('content').trim().notEmpty().isString().isLength({min: 20, max: 300}),
]
router.post('/:postId/comments', authJWT, CommentsValidator, inputValidation, async (req: Request, res: Response) => {

    const isFind = await PostsQuery.findByID(req.params.postId)
    if (!isFind) {
        return res.sendStatus(404)
    }

    const data: CommentInputModel = {content: req.body.content.trim()}
    const result = await CommentsService.createByPostId(req.params.postId, req!.user!.id, req!.user!.login, data)
    res.status(201).send(result)

})


///////////////////////////////////////////////
export const clearAllPosts = async () => {
    await PostsService.clearAll()
}

export default router