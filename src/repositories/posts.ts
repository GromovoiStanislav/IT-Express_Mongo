import {dbDemo} from "./db";
import {paginationParams} from "../middlewares/input-validation";
import {PaginatorPostViewModel, PostInputModel} from "../types/posts";



export type PostTypeBD = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}



// export type PostViewType = {
//     pagesCount: number,
//     page: number,
//     pageSize: number,
//     totalCount: number,
//     items: PostTypeBD[]
// }


const PostsCollection = dbDemo.collection<PostTypeBD>('posts')



export const Posts = {

    /////////////////////////////////////////////////
    async clearAll(): Promise<void> {
        await PostsCollection.deleteMany({})
    },


    /////////////////////////////////////////////////
    async getAll({pageNumber,pageSize,sortBy,sortDirection}:paginationParams): Promise<PaginatorPostViewModel> {
        const filter = {}

        const items = await PostsCollection
            .find(filter,  {projection: {_id: 0}})
            .limit(pageSize).skip((pageNumber-1)*pageSize)
            .sort({[sortBy]: sortDirection==='asc' ? 1: -1 })
            .toArray()

        const totalCount = await PostsCollection.countDocuments(filter)// @ts-ignore
        const pagesCount = Math.ceil(totalCount/pageSize)
        const page=pageNumber// @ts-ignore

        return {pagesCount,page,pageSize,totalCount,items}
    },


    /////////////////////////////////////////////////
    async getAllByBlogID(blogId : string, {pageNumber,pageSize,sortBy,sortDirection}:paginationParams): Promise<PaginatorPostViewModel> {
        const filter = {blogId:blogId }

        const items = await PostsCollection
            .find(filter,  {projection: {_id: 0}})
            .limit(pageSize).skip((pageNumber-1)*pageSize)
            .sort({[sortBy]: sortDirection==='asc' ? 1: -1 })
            .toArray()

        const totalCount = await PostsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount/pageSize)
        const page=pageNumber

        return {pagesCount,page,pageSize,totalCount,items}
    },


    /////////////////////////////////////////////////
    async findByID(id: string): Promise<PostTypeBD | null> {
        return PostsCollection.findOne({id},{projection: {_id: 0}})
    },


    /////////////////////////////////////////////////
    async deleteByID(id: string): Promise<Boolean> {
        const result = await PostsCollection.deleteOne({id})
        return result.deletedCount === 1
    },


    /////////////////////////////////////////////////
    async createNewPost(data: PostTypeBD): Promise<PostTypeBD> {
        await PostsCollection.insertOne(data)
        return data
    },


    /////////////////////////////////////////////////
    async updatePost(id: string, data: PostInputModel): Promise<Boolean> {
        const result = await PostsCollection.updateOne({id}, {$set: {...data}})
        return result.matchedCount === 1
    },

}

