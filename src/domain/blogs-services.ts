import {Blogs, BlogType, BlogViewType} from "../repositories/blogsDB";


//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());


export const BlogsService = {

    async clearAll(): Promise<void> {
        await Blogs.clearAll()
    },

    getAll: async function (searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string): Promise<BlogViewType> {
        let _pageNumber = parseInt(pageNumber) || 1
        let _pageSize = parseInt(pageSize) || 10
        let _sortBy = sortBy || 'createdAt'
        let _sortDirection = sortDirection || 'desc'
        if (!['desc', 'asc'].includes(_sortDirection)) {
            _sortDirection = 'desc'
        }

        return await Blogs.getAll(searchNameTerm, _pageNumber, _pageSize, _sortBy, _sortDirection)
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

