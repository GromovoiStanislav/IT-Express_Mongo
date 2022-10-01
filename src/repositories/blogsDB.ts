import {dbDemo} from "./db";

export type BlogType = {
    id?: string,
    name?: string,
    youtubeUrl?: string,
    createdAt?: string,
}

const BlogsCollection = dbDemo.collection<BlogType>('blogs')

//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());


export const Blogs = {

    async clearAll(): Promise<void> {
        await BlogsCollection.deleteMany({})
    },

    async getAll(): Promise<BlogType[]> {
        return await BlogsCollection.find({},  {projection: {_id: 0}}).toArray()
    },

    async findByID(id: string): Promise<BlogType | null> {
        return await BlogsCollection.findOne({id},{projection: {_id: 0}})
    },

    async deleteByID(id: string): Promise<Boolean> {
        const result = await BlogsCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async createNewBlog(data: BlogType): Promise<BlogType> {
        const result = await BlogsCollection.insertOne(data)
        return data
    },

    async updateBlog(id: string, data: BlogType): Promise<Boolean> {
        const result = await BlogsCollection.updateOne({id}, {$set: {...data}})
        return result.matchedCount === 1
    },

}

