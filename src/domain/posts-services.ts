import {Posts, PostType, PostViewType} from "../repositories/posts";
import {BlogsQuery} from './blogs-services'
import {paginationParams} from "../middlewares/input-validation";

//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());

export const PostsQuery = {

    async getAll(paginationParams: paginationParams): Promise<PostViewType> {
        return await Posts.getAll(paginationParams)
    },

    async findByID(id: string): Promise<PostType | null> {
        return await Posts.findByID(id)
    },


    async findPostByBlogID(blogId: string, paginationParams: paginationParams): Promise<PostViewType | null> {
        const blog = await BlogsQuery.findByID(blogId)
        if (!blog) {
            return null
        }
        return await Posts.getAllByBlogID(blogId, paginationParams)
    },


}


export const PostsService = {

    async clearAll(): Promise<void> {
        await Posts.clearAll()
    },


    async deleteByID(id: string): Promise<Boolean> {
        return await Posts.deleteByID(id)
    },

    async createNewPost(data: PostType): Promise<PostType> {
        const blog = await BlogsQuery.findByID(String(data.blogId))
        const blogName = blog ? blog.name : ""
        const newPost = {...data, id: uid(), createdAt: new Date().toISOString(), blogName}

        const result = await Posts.createNewPost({...newPost})
        return newPost
    },

    async updatePost(id: string, data: PostType): Promise<Boolean> {
        return await Posts.updatePost(id, data)
    },


    createNewPostByBlogID: async function (data: PostType): Promise<PostType | null> {
        const blog = await BlogsQuery.findByID(String(data.blogId))
        if (!blog) {
            return null
        }

        const newPost = {...data, id: uid(), createdAt: new Date().toISOString(), blogName: blog.name}
        const result = await Posts.createNewPost({...newPost})
        return newPost

    },

}