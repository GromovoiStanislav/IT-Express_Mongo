import {dbDemo} from "./db";


export type PostType = {
    id?: string,
    title?: string,
    shortDescription?: string,
    content?: string,
    blogId?: string,
    blogName?: string,
    createdAt?: string,
}
const PostsCollection = dbDemo.collection<PostType>('posts')


export const Posts = {

    async clearAll(): Promise<void> {
        await PostsCollection.deleteMany({})
    },

    async getAll(): Promise<PostType[]> {
        return await PostsCollection.find({},  {projection: {_id: 0}}).toArray()
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

