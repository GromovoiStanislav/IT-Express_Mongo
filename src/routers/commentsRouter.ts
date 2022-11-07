import {Router, Request, Response} from 'express'

import {authJWT, userIdFromJWT} from "../middlewares/authorization";
import {body} from 'express-validator';
import {inputValidation} from '../middlewares/input-validation'
import {CommentsService, CommentsQuery} from "../domain/comments-services";
import {CommentInputModel} from "../types/comments";


const router = Router();

///////////////////////////////////////////////////////
export const clearAllComments = async () => {
    await CommentsService.clearAll()
}


////////////////////////////////////////////////////////
router.get('/:commentId', userIdFromJWT, async (req: Request, res: Response) => {
    const result = await CommentsQuery.findByID(req.params.commentId, req!.userId)
    if (result) {
        res.status(200).send(result)
    } else {
        res.sendStatus(404)
    }
})


////////////////////////////////////////////////////////
router.delete('/:commentId', authJWT, async (req: Request, res: Response) => {
    const result = await CommentsService.deleteByID(req.params.commentId, req!.user!.id)
    res.sendStatus(result)
})


///////////////////////////////////////////////////////
const CommentsValidator = [
    body('content').trim().notEmpty().isString().isLength({min: 20, max: 300}),
]
router.put('/:commentId', authJWT, CommentsValidator, inputValidation, async (req: Request, res: Response) => {
    const data: CommentInputModel = {content: req.body.content.trim()}
    const result = await CommentsService.updateByID(req.params.commentId, req!.user!.id, data)
    res.sendStatus(result)
})


///////////////////////////////////////////////////////
const CommentsLikeStatusValidator = [
    body('likeStatus').trim().notEmpty().isString().toLowerCase().isIn(['none', 'like', 'dislike']),
]
router.put('/:commentId/like-status', authJWT, CommentsLikeStatusValidator, inputValidation, async (req: Request, res: Response) => {
    const likeStatus = req.body.content.trim()
    const result = await CommentsService.updateLikeByID(req.params.commentId, {
        userId: req!.user!.id,
        userLogin: req!.user!.login
    }, likeStatus)
    res.sendStatus(result)
})


export default router