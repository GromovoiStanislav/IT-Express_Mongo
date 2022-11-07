import {CommentDBType, Comments} from "../repositories/comments";
import {CommentLikes} from "../repositories/comment-likes";
import {paginationParams} from '../middlewares/input-validation'
import {CommentInputModel, CommentsViewModel, CommentViewModel} from "../types/comments";

const uid = () => String(Date.now());

export const CommentsService = {


    ///////////////////////////////////////////////////////
    async clearAll(): Promise<void> {
        await Comments.clearAll()
        await CommentLikes.clearAll()
    },


    ///////////////////////////////////////////////////////
    async deleteByID(commentId: string, userId: string): Promise<number> {
        const res = await Comments.findByID(commentId)
        if (!res) {
            return 404
        }
        if (res.userId !== userId) {
            return 403
        }

        const result = await Comments.deleteByID(commentId)
        if (result) {
            await CommentLikes.deleteByCommentID(commentId)
            return 204
        }
        return 404
    },


    ///////////////////////////////////////////////////////
    async updateByID(id: string, userId: string, data: CommentInputModel): Promise<number> {
        const res = await Comments.findByID(id)
        if (!res) {
            return 404
        }
        if (res.userId !== userId) {
            return 403
        }

        const result = await Comments.updateByID(id, data)
        if (result) {
            return 204
        }
        return 404
    },


    ///////////////////////////////////////////////////////
    async updateLikeByID(commentId: string, user: { userId: string, userLogin: string }, likeStatus: string): Promise<number> {
        const res = await Comments.findByID(commentId)
        if (!res) {
            return 404
        }

        if (likeStatus === 'none') {
            const result = await CommentLikes.deleteByCommentIDUserID(commentId, user.userId)
            if (result) {
                return 204
            }
            return 404
        }

        likeStatus = likeStatus[0].toUpperCase() + likeStatus.slice(1)

        const result = await CommentLikes.updateLikeByID(commentId, user.userId, user.userLogin, likeStatus)
        if (result) {
            return 204
        }
        return 404
    },


    ///////////////////////////////////////////////////////
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
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
            }
        }
    },

}

/////////////////////////////////////////////////////////////////////////
export const CommentsQuery = {

    /////////////////////////////////////////////////////
    async findByID(commentId: string, userId?: string): Promise<CommentViewModel | null> {
        const res = await Comments.findByID(commentId)
        if (!res) {
            return null
        }

        return {
            id: res.id,
            content: res.content,
            userId: res.userId,
            userLogin: res.userLogin,
            createdAt: res.createdAt,
            likesInfo: await CommentLikes.likesByCommentID(commentId, userId)
        }
    },

    ////////////////////////////////////////////////////
    async findAllByPostId(postId: string, paginationParams: paginationParams, userId: string): Promise<CommentsViewModel | null> {

        const result = await Comments.findAllByPostId(postId, paginationParams) as CommentsViewModel
        result.items = await Promise.all( result.items.map(async el => ({
            id: el.id,
            content: el.content,
            userId: el.userId,
            userLogin: el.userLogin,
            createdAt: el.createdAt,
            likesInfo: await CommentLikes.likesByCommentID(el.id, userId)
        })))

        return result
    },

}