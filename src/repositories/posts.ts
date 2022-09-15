interface IPost {
    id?: string,
    title?: string,
    shortDescription?: string,
    content?: string,
    blogId?: string,
    blogName?: string,
}

const PostsBD: Array<IPost> = []


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
}