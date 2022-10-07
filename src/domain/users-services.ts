import {Users, UserType} from "../repositories/users";
import {UserInputModel, UsersViewModel, UserViewModel} from "../types/users";
import bcryptjs from 'bcryptjs'
import {paginationParams} from '../middlewares/input-validation'



//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());


export const UsersService = {

    async clearAll(): Promise<void> {
        await Users.clearAll()
    },

    async deleteByID(id: string): Promise<Boolean> {
        return await Users.deleteByID(id)
    },

    async createNewUser(data: UserInputModel): Promise<UserViewModel> {

        const newUser: UserType = {
            login: data.login,
            email: data.email,
            password: await this._generateHash(data.password),
            id: uid(),
            createdAt: new Date().toISOString(),
        }

        await Users.createNewUser({...newUser})

        return {
            login: newUser.login,
            email: newUser.email,
            id: newUser.id,
            createdAt: newUser.createdAt,
        }
    },


    async _generateHash(password: string): Promise<string> {
        const solt = await bcryptjs.genSalt(10)
        return await bcryptjs.hash(password, solt)
        //const soltFromHash = await bcryptjs.getSalt(hash)
    }

}

export const UsersQuery = {

    async getAll (searchLoginTerm: string, searchEmailTerm: string,paginationParams:paginationParams): Promise<UsersViewModel> {

        const result = await Users.getAll(searchLoginTerm,searchEmailTerm, paginationParams)

        //На всякий случай
        result.items = result.items.map(el=>({
            id: el.id,
            login: el.login,
            email: el.email,
            createdAt: el.createdAt,
        }))

        return result
    },

}

