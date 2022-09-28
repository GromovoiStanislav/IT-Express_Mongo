export type BlogType = {
    id?: string,
    name?: string,
    youtubeUrl?: string,
}

const BlogsBD: Array<BlogType> = []

const uid = () => String(Date.now());

export const Blogs = {
    async getAll(): Promise<BlogType[]> {
        return BlogsBD
    },

    async clearAll(): Promise<void> {
        BlogsBD.length = 0
    },

    async findByID(id: string): Promise<BlogType | null> {
        const blog = BlogsBD.find(v => v.id == id)
        if (blog) return blog
        return null
    },

    async deleteByID(id: string): Promise<Boolean> {
        const itemId = BlogsBD.findIndex(v => v.id == id)
        if (itemId >= 0) {
            BlogsBD.splice(itemId, 1)
            return true
        }
        return false
    },

    async createNewBlog(data: BlogType): Promise<BlogType> {
        const newBlog = {...data, id: String(BlogsBD.length + 1)}
        BlogsBD.push(newBlog)
        return newBlog
    },

    async updateBlog(id: string, data: BlogType): Promise<Boolean> {
        const itemId = BlogsBD.findIndex(v => v.id == id)
        if (itemId == -1) {
            return false
        }

        BlogsBD[itemId] = {...BlogsBD.at(itemId), ...data}
        return true
    },


}