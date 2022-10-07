import {dbDemo} from "./db";
import {paginationParams} from '../middlewares/input-validation'

export type UserType = {
    id?: string,
    name: string,
    youtubeUrl: string,
    createdAt?: string,
}


const UsersCollection = dbDemo.collection<UserType>('users')

export const Users = {
    async clearAll(): Promise<void> {
        await UsersCollection.deleteMany({})
    },


}