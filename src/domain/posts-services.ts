import {Posts, PostTypeBD} from "../repositories/posts";
import {BlogsQuery} from './blogs-services'
import {paginationParams} from "../middlewares/input-validation";
import {PaginatorPostViewModel, PostInputModel, PostViewModel} from "../types/posts";
import {PostLikes} from "../repositories/post-likes";



//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());

export const PostsQuery = {

    /////////////////////////////////////////////////
    async getAll(paginationParams: paginationParams, userId?: string): Promise<PaginatorPostViewModel> {
        const result = await Posts.getAll(paginationParams)
        result.items = await Promise.all(result.items.map(async el => ({
            id: el.id,
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt,
            extendedLikesInfo: await PostLikes.likesInfoByPostID(el.id, userId)
        })))
        return result
    },


    /////////////////////////////////////////////////
    async findByID(id: string, userId?: string): Promise<PostViewModel | null> {
        const findedPost = await Posts.findByID(id)
        if (!findedPost) {
            return null
        }
        const outPost = {
            id: findedPost.id,
            title: findedPost.title,
            shortDescription: findedPost.shortDescription,
            content: findedPost.content,
            blogId: findedPost.blogId,
            blogName: findedPost.blogName,
            createdAt: findedPost.createdAt,
            extendedLikesInfo: await PostLikes.likesInfoByPostID(findedPost.id, userId)
        }

        return outPost
    },


    /////////////////////////////////////////////////
    async findPostByBlogID(blogId: string, paginationParams: paginationParams): Promise<PaginatorPostViewModel | null> {
        const blog = await BlogsQuery.findByID(blogId)
        if (!blog) {
            return null
        }
        return await Posts.getAllByBlogID(blogId, paginationParams)
    },

}


export const PostsService = {

    /////////////////////////////////////////////////
    async clearAll(): Promise<void> {
        await Posts.clearAll()
        await PostLikes.clearAll()
    },


    /////////////////////////////////////////////////
    async deleteByID(id: string): Promise<Boolean> {
        const result = await Posts.deleteByID(id)
        if (result) {
            await PostLikes.deleteByPostID(id)
        }
        return result
    },


    /////////////////////////////////////////////////
    async createNewPost(data: PostInputModel): Promise<PostViewModel> {
        const blog = await BlogsQuery.findByID(String(data.blogId))
        const blogName = blog ? blog.name : ""
        const newPost = {...data, id: uid(), createdAt: new Date().toISOString(), blogName}

        const result = await Posts.createNewPost(newPost)

        const outPost = {
            id: result.id,
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: []
            }
        }

        return outPost
    },


    /////////////////////////////////////////////////
    async updatePost(id: string, data: PostInputModel): Promise<Boolean> {
        return await Posts.updatePost(id, data)
    },


    /////////////////////////////////////////////////
    createNewPostByBlogID: async function (data: PostInputModel): Promise<PostViewModel | null> {
        const blog = await BlogsQuery.findByID(String(data.blogId))
        if (!blog) {
            return null
        }
        const newPost = {...data, id: uid(), createdAt: new Date().toISOString(), blogName: blog.name}
        const result = await Posts.createNewPost({...newPost})

        const outPost = {
            id: result.id,
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: []
            }
        }

        return outPost
    },


    ///////////////////////////////////////////////////////
    async updateLikeByID(postId: string, user: { userId: string, userLogin: string }, likeStatus: string): Promise<number> {
        const res = await Posts.findByID(postId)
        if (!res) {
            return 404
        }

        if (likeStatus === 'none') {
            const result = await PostLikes.deleteByPostIDUserID(postId, user.userId)
            if (result) {
                return 204
            }
            return 404
        }

        likeStatus = likeStatus[0].toUpperCase() + likeStatus.slice(1)

        const result = await PostLikes.updateLikeByID(postId, user.userId, user.userLogin, likeStatus)
        if (result) {
            return 204
        }
        return 404
    },

}