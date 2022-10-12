import {Router, Request, Response} from 'express'

import {authJWT} from "../middlewares/authorization";
import {body, query} from 'express-validator';
import {inputValidation} from '../middlewares/input-validation'
import {CommentsService, CommentsQuery} from "../domain/comments-services";
import {CommentInputModel} from "../types/comments";

const router = Router();


export const clearAllComments = async () => {
    await CommentsService.clearAll()
}


router.get('/:id', async (req: Request, res: Response) => {
    const result = await CommentsQuery.findByID(req.params.id)
    if (result) {
        res.sendStatus(200)
    } else {
        res.sendStatus(404)
    }
})

router.delete('/:id', authJWT, async (req: Request, res: Response) => {
    const result = await CommentsService.deleteByID(req.params.id, req!.user!.id)
    res.sendStatus(result)
})


const CommentsValidator = [
    body('content').trim().notEmpty().isString().isLength({min: 20, max: 300}),
]

router.put('/:id', authJWT, CommentsValidator, inputValidation, async (req: Request, res: Response) => {
    const data:CommentInputModel = {content: req.body.content.trim()}
    const result = await CommentsService.updateByID(req.params.id, req!.user!.id,data)
    res.sendStatus(result)
})


export default router