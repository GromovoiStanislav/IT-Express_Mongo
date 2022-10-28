import {dbDemo} from "./db";
import {paginationParams} from '../middlewares/input-validation'

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

    async getAll(searchNameTerm:string,{pageNumber,pageSize,sortBy,sortDirection}:paginationParams): Promise<BlogViewType> {
        // const filter:{name?:any} = {}
        // if(searchNameTerm){filter.name = {$regex:searchNameTerm, $options: 'i'}}
        const nameRegExp = RegExp(`${searchNameTerm||''}`,'i')
        const filter={name:nameRegExp}

        const items = await BlogsCollection
            .find(filter,  {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection==='asc' ? 1: -1 })
            .limit(pageSize).skip((pageNumber-1)*pageSize)
            .toArray()

        const totalCount = await BlogsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount/pageSize)
        const page=pageNumber

        return {pagesCount,page,pageSize,totalCount,items}
    },

    async findByID(id: string): Promise<BlogType | null> {
        return await BlogsCollection.findOne({id},{projection: {_id: 0}})
    },

    async deleteByID(id: string): Promise<boolean> {
        const result = await BlogsCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async createNewBlog(data: BlogType): Promise<BlogType> {
        const result = await BlogsCollection.insertOne(data)
        return data
    },

    async updateBlog(id: string, data: BlogType): Promise<boolean> {
        const result = await BlogsCollection.updateOne({id}, {$set: {...data}})
        return result.matchedCount === 1
    },

}

