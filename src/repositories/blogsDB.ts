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
        //return await BlogsCollection.find({}, {_id: 0}).toArray()

        const result = await BlogsCollection.find({}).toArray()
        result.forEach(r=>delete r._id)
        return result
    },

    async findByID(id: string): Promise<BlogType | null> {
        const result = await BlogsCollection.findOne({id})
        delete result._id
        if (result) return result
        return null
    },

    async deleteByID(id: string): Promise<Boolean> {
        const result = await BlogsCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async createNewBlog(data: BlogType): Promise<BlogType> {
        const newBlog = {...data, id: uid(), createdAt: new Date().toISOString()}
        const result = await BlogsCollection.insertOne(newBlog)
        return newBlog
    },

    async updateBlog(id: string, data: BlogType): Promise<Boolean> {
        const result = await BlogsCollection.updateOne({id}, {$set: {...data}})
        return result.matchedCount === 1
    },


}

