import {dbDemo} from "./db";
import {CommentInputModel, CommentsRawViewModel} from "../types/comments";
import {paginationParams} from "../middlewares/input-validation";


export type CommentDBType = {
    _id?: string,
    id: string,
    postId:string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string,
}


const CommentsCollection = dbDemo.collection<CommentDBType>('comments')

export const Comments = {

    async clearAll(): Promise<void> {
        await CommentsCollection.deleteMany({})
    },

    async deleteByID(id: string): Promise<Boolean> {
        const result = await CommentsCollection.deleteOne({id})
        return result.deletedCount === 1
    },


    async findByID(id: string): Promise<CommentDBType | null> {
        return await CommentsCollection.findOne({id},{projection: {_id: 0}})
    },

    async updateByID(id: string, data: CommentInputModel): Promise<Boolean> {
        const result = await CommentsCollection.updateOne({id}, {$set: {...data}})
        return result.matchedCount === 1
    },

    async findAllByPostId(postId: string, {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
    }: paginationParams ): Promise<CommentsRawViewModel> {

        const items = await CommentsCollection
            .find({postId}, {projection: {_id:0}})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .limit(pageSize).skip((pageNumber - 1) * pageSize)
            .toArray()

        const totalCount = await CommentsCollection.countDocuments({postId})
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = pageNumber

        return {pagesCount, page, pageSize, totalCount, items}
    },

    async createNew(data: CommentDBType): Promise<Boolean> {
        await CommentsCollection.insertOne(data)
        return true
    },


}