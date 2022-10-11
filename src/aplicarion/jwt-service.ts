import jwt from 'jsonwebtoken'
import {settings} from '../settigs'
import {UserDBType} from "../repositories/users";


type userJWT = {
    userId:string
}


export const jwtService = {

    async createJWT (user: UserDBType): Promise<string> {
        return jwt.sign(
            {userId: user.id},
            settings.JWT_SECRET,
            {expiresIn: '1h'})
    },

    async getUserIdByToken(token:string):Promise<string|null>{
       try {
           const result = jwt.verify(token, settings.JWT_SECRET) as userJWT
           return result.userId
       }catch (e) {
           return null
       }
    },
}