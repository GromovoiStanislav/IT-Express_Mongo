import {dbDemo} from "./db";
import {paginationParams} from '../middlewares/input-validation'


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

    async deleteByID(id: string): Promise<Boolean> {
        const result = await UsersCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async createNewUser(data: UserType): Promise<Boolean> {
        await UsersCollection.insertOne(data)
        return true
    },

}