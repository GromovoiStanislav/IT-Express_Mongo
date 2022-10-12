import {Comments,CommentType} from "../repositories/comments";
import {paginationParams} from '../middlewares/input-validation'
import {CommentInputModel, CommentViewModel, CommentsViewModel} from "../types/comments";
import {PostsQuery} from "./posts-services";


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

    async updateByID(id: string, userId: string, data:CommentInputModel): Promise<number> {
        let res = await Comments.findByID(id)
        if (!res) {
            return 404
        }
        if (res.userId !== userId) {
            return 403
        }

        let result = await Comments.updateByID(id,data)
        if (result) {
            return 204
        }
        return 404
    },



}

export const CommentsQuery = {

    async findByID(id: string): Promise<CommentViewModel | null> {
        const res = await Comments.findByID(id)

        if(!res){return null}

        const result = {
                id: res.id,
                content: res.content,
                userId: res.userId,
                userLogin: res.userLogin,
                createdAt: res.createdAt,
        }
        return result


    },


    async findAllByPostId(postId: string, paginationParams:paginationParams): Promise<CommentsViewModel | null> {

        const res = await PostsQuery.findByID(postId)
        if(!res){return null}


        const result =  await Comments.findAllByPostId(postId, paginationParams)
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