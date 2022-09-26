interface IBlog {
    id?: string,
    name?: string,
    youtubeUrl?: string,
}

const BlogsBD: Array<IBlog> = []

export const Blogs = {
    getAll() {
        return BlogsBD
    },

    clearAll() {
        BlogsBD.length = 0
    },

    findByID(id: string) {
        return BlogsBD.find(v => v.id == id)
    },

    deleteByID(id: string) {
        const itemId = BlogsBD.findIndex(v => v.id == id)
        if (itemId >= 0) {
            BlogsBD.splice(itemId, 1)
            return true
        }
        return false
    },

    createNewBlog(data:IBlog){
        const newBlog = {...data, id:String(BlogsBD.length+1)}
        BlogsBD.push(newBlog)
        return newBlog
    },

    updateBlog(id:string,data:IBlog){
        const itemId = BlogsBD.findIndex(v => v.id == id)
        if (itemId == -1) {
            return false
        }

        BlogsBD[itemId] = {...BlogsBD.at(itemId), ...data}
        return true
    },


}