import {Posts, PostType} from "../repositories/postsDB";
import {Blogs} from '../repositories/blogsDB'

//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());


export const PostsService = {

    async clearAll(): Promise<void> {
        await Posts.clearAll()
    },

    async getAll(): Promise<PostType[]> {
        return await Posts.getAll()
    },

    async findByID(id: string): Promise<PostType | null> {
        return await Posts.findByID(id)
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

}