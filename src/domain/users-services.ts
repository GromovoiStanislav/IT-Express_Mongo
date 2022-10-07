
import {Users, UserType} from "../repositories/users";
import {paginationParams} from '../middlewares/input-validation'

//const uid= ()=>Math.random().toString(36).substring(2)
const uid = () => String(Date.now());



export const UsersService = {

    async clearAll(): Promise<void> {
        await Users.clearAll()
    },
}