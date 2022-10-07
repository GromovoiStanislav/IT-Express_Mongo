import {dbDemo} from "./db";
import {paginationParams} from '../middlewares/input-validation'
import {UsersViewModel} from "../types/users";


export type UserType = {
    id: string,
    login: string,
    password: string,
    email: string
    createdAt: string,
}

const UsersCollection = dbDemo.collection<UserType>('users')

export const Users = {
    async clearAll(): Promise<void> {
        await UsersCollection.deleteMany({})
    },

    async getAll(searchLoginTerm: string, searchEmailTerm: string, {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
    }: paginationParams): Promise<UsersViewModel> {

        const loginRegExp = RegExp(`${searchLoginTerm}`, 'i')
        const emailRegExp = RegExp(`${searchEmailTerm}`, 'i')

        type FilterType = {
            [key: string]: unknown
        }
        const filter: FilterType = {}

        if (searchLoginTerm !== '' && searchEmailTerm !== '') {
            filter.$or = [
                {login: loginRegExp},
                {email: emailRegExp}
            ]
        } else if (searchLoginTerm !== '') {
            filter.login = loginRegExp
        } else if (searchEmailTerm !== '') {
            filter.email = emailRegExp
        }


        const items = await UsersCollection
            .find(filter, {projection: {_id:0,password:0}})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .limit(pageSize).skip((pageNumber - 1) * pageSize)
            .toArray()

        const totalCount = await UsersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const page = pageNumber

        return {pagesCount, page, pageSize, totalCount, items}
    },


    async getUserByLogin(login:string):Promise<UserType| null>{
        return await UsersCollection
            .findOne({login})
    },

    async deleteByID(id: string): Promise<Boolean> {
        const result = await UsersCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async createNewUser(data: UserType): Promise<Boolean> {
        await UsersCollection.insertOne(data)
        return true
    },

}