import {dbDemo} from "./db";
import {BlogType} from "./blogs";


export type CommentType = {
    id?: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt?: string,
}





const CommentsCollection = dbDemo.collection<CommentType>('comments')

export const Comments = {

    async clearAll(): Promise<void> {
        await CommentsCollection.deleteMany({})
    },

    async deleteByID(id: string): Promise<Boolean> {
        const result = await CommentsCollection.deleteOne({id})
        return result.deletedCount === 1
    },


    async findByID(id: string): Promise<CommentType | null> {
        return await CommentsCollection.findOne({id},{projection: {_id: 0}})
    },

    async updateByID(id: string, content: string): Promise<Boolean> {
        const result = await CommentsCollection.updateOne({id}, {$set: {content}})
        return result.matchedCount === 1
    },

}