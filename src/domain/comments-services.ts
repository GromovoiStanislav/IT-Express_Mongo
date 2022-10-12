import {CommentDBType, Comments} from "../repositories/comments";
import {paginationParams} from '../middlewares/input-validation'
import {CommentInputModel, CommentsViewModel, CommentViewModel} from "../types/comments";


const uid = () => String(Date.now());


export const CommentsService = {

    async clearAll(): Promise<void> {
        await Comments.clearAll()
    },

    async deleteByID(id: string, userId: string): Promise<number> {
        let res = await Comments.findByID(id)
        if (!res) {
            return 404
        }
        if (res.userId !== userId) {
            return 403
        }

        let result = await Comments.deleteByID(id)
        if (result) {
            return 204
        }
        return 404
    },

    async updateByID(id: string, userId: string, data: CommentInputModel): Promise<number> {
        let res = await Comments.findByID(id)
        if (!res) {
            return 404
        }
        if (res.userId !== userId) {
            return 403
        }

        let result = await Comments.updateByID(id, data)
        if (result) {
            return 204
        }
        return 404
    },


    async createByPostId(postId: string, userId: string, userLogin: string, data: CommentInputModel): Promise<CommentViewModel> {

        const newComment: CommentDBType = {
            id: uid(),
            postId: postId,
            content: data.content,
            userId: userId,
            userLogin: userLogin,
            createdAt: new Date().toISOString(),
        }

        await Comments.createNew({...newComment})

        return {
            id: newComment.id,
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            createdAt: newComment.createdAt,
        }
    },


}

export const CommentsQuery = {

    async findByID(id: string): Promise<CommentViewModel | null> {
        const res = await Comments.findByID(id)

        if (!res) {
            return null
        }

        return {
            id: res.id,
            content: res.content,
            userId: res.userId,
            userLogin: res.userLogin,
            createdAt: res.createdAt,
        }


    },


    async findAllByPostId(postId: string, paginationParams: paginationParams): Promise<CommentsViewModel | null> {

        const result = await Comments.findAllByPostId(postId, paginationParams)
        result.items = result.items.map(el => ({
            id: el.id,
            content: el.content,
            userId: el.userId,
            userLogin: el.userLogin,
            createdAt: el.createdAt,
        }))


        return result
    },


}