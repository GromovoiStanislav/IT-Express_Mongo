import {Comments, CommentType} from "../repositories/comments";
import {Blogs} from "../repositories/blogs";

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

    async updateByID(id: string, userId: string,content:string): Promise<number> {
        let res = await Comments.findByID(id)
        if (!res) {
            return 404
        }
        if (res.userId !== userId) {
            return 403
        }

        let result = await Comments.updateByID(id,content)
        if (result) {
            return 204
        }
        return 404
    },



}

export const CommentsQuery = {

    async findByID(id: string): Promise<CommentType | null> {
        let result = await Comments.findByID(id)
        //на всякий случай
        if (result) {
            result = {
                id: result.id,
                content: result.content,
                userId: result.userId,
                userLogin: result.userLogin,
                createdAt: result.createdAt,
            }
        }

        return result
    },

}