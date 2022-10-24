import jwt from 'jsonwebtoken'
import {settings} from '../settigs'



type userJWT = {
    userId: string
}


export const jwtService = {

    async createJWT(userId: string, expiresIn: string): Promise<string> {
        return jwt.sign(
            {userId},
            settings.JWT_SECRET,
            {expiresIn})
    },

    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as userJWT
            return result.userId
        } catch (e) {
            return null
        }
    },
}