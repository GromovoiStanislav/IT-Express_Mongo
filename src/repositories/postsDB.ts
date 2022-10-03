import {dbDemo} from "./db";
import {BlogType} from "./blogsDB";


export type PostType = {
    id?: string,
    title?: string,
    shortDescription?: string,
    content?: string,
    blogId?: string,
    blogName?: string,
    createdAt?: string,
}

export type PostViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostType[]
}


const PostsCollection = dbDemo.collection<PostType>('posts')


export const Posts = {

    async clearAll(): Promise<void> {
        await PostsCollection.deleteMany({})
    },

    async getAll(pageNumber:number,pageSize:number,sortBy:string,sortDirection:string): Promise<PostViewType> {
        const filter:any = {}

        const items = await PostsCollection
            .find(filter,  {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection==='asc' ? 1: -1 })
            .toArray()

        const totalCount = await PostsCollection.countDocuments(filter)

        // @ts-ignore
        const pagesCount = Math.ceil(totalCount/pageSize)
        const page=pageNumber

        // @ts-ignore
        return {pagesCount,page,pageSize,totalCount,items}

    },


    async getAllByBlogID(blogId : string, pageNumber:number,pageSize:number,sortBy:string,sortDirection:string): Promise<PostViewType> {
        const filter:any = {blogId:blogId }

        const items = await PostsCollection
            .find(filter,  {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection==='asc' ? 1: -1 })
            .toArray()

        const totalCount = await PostsCollection.countDocuments(filter)

        // @ts-ignore
        const pagesCount = Math.ceil(totalCount/pageSize)
        const page=pageNumber

        // @ts-ignore
        return {pagesCount,page,pageSize,totalCount,items}

    },




    async findByID(id: string): Promise<PostType | null> {
        return await PostsCollection.findOne({id},{projection: {_id: 0}})
    },

    async deleteByID(id: string): Promise<Boolean> {
        const result = await PostsCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async createNewPost(data: PostType): Promise<PostType> {
        const result = await PostsCollection.insertOne(data)
        return data
    },

    async updatePost(id: string, data: PostType): Promise<Boolean> {
        const result = await PostsCollection.updateOne({id}, {$set: {...data}})
        return result.matchedCount === 1
    },

}

