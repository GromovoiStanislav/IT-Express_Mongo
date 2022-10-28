import jwt from 'jsonwebtoken'
import {settings} from '../settigs'
import {refreshTokenDBType, refreshTokens} from "../repositories/refreshTokens";
import {v4 as uuidv4} from 'uuid'


type RefreshJWT = {
    userId: string,
    deviceId: string,
    iat: number,
    exp: number,
}

export const jwtService = {

    ////////////////////////////////////
    async createAuthJWT(userId: string): Promise<string> {
        return jwt.sign(
            {userId},
            settings.JWT_SECRET,
            {expiresIn: '10s'})
    },


    ////////////////////////////////////
    async createRefreshJWT(userId: string, deviceId: string, ip: string, title: string
    ):
        Promise<string> {

        const refreshToken = jwt.sign(
            {userId, deviceId,},
            settings.JWT_SECRET,
            {expiresIn: '20s'})

        const result = jwt.verify(refreshToken, settings.JWT_SECRET) as RefreshJWT
        const dataRefreshToken: refreshTokenDBType = {
            userId,
            deviceId,
            ip,
            title,
            issuedAt: result.iat,
            expiresIn: result.exp,
        }
        await refreshTokens.addOrUpdateToken(dataRefreshToken)

        return refreshToken
    },


    ////////////////////////////////////
    async getInfoByToken(token: string): Promise<{ userId: string, deviceId: string } | null> {
        try {
            const decoded = jwt.verify(token, settings.JWT_SECRET) as RefreshJWT

            const result = await refreshTokens.findToken(decoded.deviceId, decoded.iat)
            if (!result) {
                return null
            }

            return {
                userId: decoded.userId,
                deviceId: decoded.deviceId,
            }

        } catch (e) {
            return null
        }
    },


    ////////////////////////////////////
    async killSessionByToken(token: string): Promise<Boolean> {
        try {
            const decoded = jwt.verify(token, settings.JWT_SECRET) as RefreshJWT

            const result = await refreshTokens.findToken(decoded.deviceId, decoded.iat)
            if (!result) {
                return false
            }

            return await refreshTokens.deleteByDeviceId(decoded.deviceId)

        } catch (e) {
            return false
        }
    },

}