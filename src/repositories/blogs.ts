import {dbDemo} from "./db";

export type BlogType = {
    id?: string,
    name: string,
    youtubeUrl: string,
    createdAt?: string,
}

export type BlogViewType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogType[]
}


const BlogsCollection = dbDemo.collection<BlogType>('blogs')


export const Blogs = {

    async clearAll(): Promise<void> {
        await BlogsCollection.deleteMany({})
    },

    async getAll(searchNameTerm:string,pageNumber:number,pageSize:number,sortBy:string,sortDirection:string): Promise<BlogViewType> {

        const filter:any = {}
        if(searchNameTerm){filter.name = {$regex:searchNameTerm, $options: 'i'}}

        const items = await BlogsCollection
            .find(filter,  {projection: {_id: 0}})
            .limit(pageSize).skip((pageNumber-1)*pageSize)
            .sort({[sortBy]: sortDirection==='asc' ? 1: -1 })
            .toArray()

        const totalCount = await BlogsCollection.countDocuments(filter)

        // @ts-ignore
        const pagesCount = Math.ceil(totalCount/pageSize)
        const page=pageNumber

        // @ts-ignore
        return {pagesCount,page,pageSize,totalCount,items}
    },

    async findByID(id: string): Promise<BlogType | null> {
        return await BlogsCollection.findOne({id},{projection: {_id: 0}})
    },

    async deleteByID(id: string): Promise<Boolean> {
        const result = await BlogsCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async createNewBlog(data: BlogType): Promise<BlogType> {
        const result = await BlogsCollection.insertOne(data)
        return data
    },

    async updateBlog(id: string, data: BlogType): Promise<Boolean> {
        const result = await BlogsCollection.updateOne({id}, {$set: {...data}})
        return result.matchedCount === 1
    },

}

