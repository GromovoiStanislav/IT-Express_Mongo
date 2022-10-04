import {Posts, PostType, PostViewType} from "../repositories/posts";
import {Blogs} from '../repositories/blogs'

//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());


export const PostsService = {

    async clearAll(): Promise<void> {
        await Posts.clearAll()
    },

    async getAll(pageNumber: string, pageSize: string, sortBy: string, sortDirection: string): Promise<PostViewType> {

        let _pageNumber = parseInt(pageNumber) || 1
        let _pageSize = parseInt(pageSize) || 10
        let _sortBy = sortBy || 'createdAt'
        let _sortDirection = sortDirection || 'desc'
        if (!['desc', 'asc'].includes(_sortDirection)) {
            _sortDirection = 'desc'
        }

        return await Posts.getAll(_pageNumber, _pageSize, _sortBy, _sortDirection)
    },

    async findByID(id: string): Promise<PostType | null> {
        return await Posts.findByID(id)
    },

    async findByBlogID(blogId: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string): Promise<PostViewType | null> {
        const blog = await Blogs.findByID(blogId)
        if (!blog) {
            return null
        }

        let _pageNumber = parseInt(pageNumber) || 1
        let _pageSize = parseInt(pageSize) || 10
        let _sortBy = sortBy || 'createdAt'
        let _sortDirection = sortDirection || 'desc'
        if (!['desc', 'asc'].includes(_sortDirection)) {
            _sortDirection = 'desc'
        }

        return await Posts.getAllByBlogID(blogId, _pageNumber, _pageSize, _sortBy, _sortDirection)
    },


    async deleteByID(id: string): Promise<Boolean> {
        return await Posts.deleteByID(id)
    },

    async createNewPost(data: PostType): Promise<PostType> {
        const blog = await Blogs.findByID(String(data.blogId))
        const blogName = blog ? blog.name : ""
        const newPost = {...data, id: uid(), createdAt: new Date().toISOString(), blogName}

        const result = await Posts.createNewPost({...newPost})
        return newPost
    },

    async updatePost(id: string, data: PostType): Promise<Boolean> {
        return await Posts.updatePost(id, data)
    },


    createNewByBlogID: async function (data: PostType): Promise<PostType | null> {
        const blog = await Blogs.findByID(String(data.blogId))
        if (!blog) {
            return null
        }

        const newPost = {...data, id: uid(), createdAt: new Date().toISOString(), blogName:blog.name}
        const result = await Posts.createNewPost({...newPost})
        return newPost

    },


}