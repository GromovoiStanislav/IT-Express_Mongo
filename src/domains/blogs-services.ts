import {Blogs, BlogType} from "../repositories/blogsDB";


//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());


export const BlogsService = {

    async clearAll(): Promise<void> {
        await Blogs.clearAll()
    },

    async getAll(): Promise<BlogType[]> {
        return await Blogs.getAll()
    },

    async findByID(id: string): Promise<BlogType | null> {
        return await Blogs.findByID(id)
    },

    async deleteByID(id: string): Promise<Boolean> {
        return await Blogs.deleteByID(id)
    },

    async createNewBlog(data: BlogType): Promise<BlogType> {
        const newBlog = {...data, id: uid(), createdAt: new Date().toISOString()}
        const result = await Blogs.createNewBlog({...newBlog})
        return newBlog
    },

    async updateBlog(id: string, data: BlogType): Promise<Boolean> {
        return await Blogs.updateBlog(id, data)
    },

}

