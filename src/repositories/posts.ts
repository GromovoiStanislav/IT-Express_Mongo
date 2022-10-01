import {Blogs} from './blogsDB'

export type PostType = {
    id?: string,
    title?: string,
    shortDescription?: string,
    content?: string,
    blogId?: string,
    blogName?: string,
    createdAt?: string,
}

const PostsBD: Array<PostType> = []

const uid = () => String(Date.now());

export const Posts = {
    getAll() {
        return PostsBD
    },

    clearAll() {
        PostsBD.length = 0
    },

    findByID(id: string) {
        return PostsBD.find(v => v.id == id)
    },

    deleteByID(id:string){
        const itemId = PostsBD.findIndex(v => v.id == id)
        if (itemId >= 0) {
            PostsBD.splice(itemId, 1)
            return true
        }
        return false
    },

    async createNewPost(data: PostType) {
        const blog = await Blogs.findByID(String(data.blogId))
        const blogName = blog ? blog.name : ""
        const newPost = {...data, id: uid(), createdAt: new Date().toISOString(), blogName}
        PostsBD.push(newPost)
        return newPost
    },

    updatePost(id:string,data:PostType){
        const itemId = PostsBD.findIndex(v => v.id == id)
        if (itemId == -1) {
            return false
        }

        PostsBD[itemId] = {...PostsBD[itemId], ...data}
        return true
    },

}