import {Users, UserType} from "../repositories/users";
import {UserInputModel, UserViewModel} from "../types/users";
import bcript from 'bcryptjs'

//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());


export const UsersService = {

    async clearAll(): Promise<void> {
        await Users.clearAll()
    },

    async deleteByID(id: string): Promise<Boolean> {
        return await Users.deleteByID(id)
    },

    createNewUser: async function (data: UserInputModel): Promise<UserViewModel> {

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
        const solt = await bcript.genSalt(10)
        const hash = await bcript.hash(password, solt)
        console.log('hash',hash)
        console.log('solt',solt)
        const soltFromHash = await bcript.getSalt(hash)
        console.log('solt from hash',soltFromHash)
        return hash
    }

}

