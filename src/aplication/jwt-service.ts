import jwt from 'jsonwebtoken'
import {settings} from '../settigs'
import {refreshTokenDBType, refreshTokens} from "../repositories/refreshTokens";

type RefreshJWT = {
    userId: string,
    deviceId: string,
    issuedAt: string,
    iat: number,
    exp: number,
}

type AuthJWT = {
    userId: string,
}

export const jwtService = {

    ////////////////////////////////////
    async createAuthJWT(userId: string): Promise<string> {
        return jwt.sign(
            {userId},
            settings.JWT_SECRET,
            {expiresIn: '5m'})
    },


    ////////////////////////////////////
    async createRefreshJWT(userId: string, deviceId: string, ip: string, title: string
    ):
        Promise<string> {
        const issuedAt = Date.now()
        const dataRefreshToken: refreshTokenDBType = {
            userId,
            deviceId,
            ip,
            title,
            issuedAt: new Date(issuedAt).toISOString(),
            expiresIn: new Date(issuedAt + 60*60*24 * 1000).toISOString(),
        }

        const refreshToken = jwt.sign(
            {userId, deviceId, issuedAt: new Date(issuedAt).toISOString()},
            settings.JWT_SECRET,
            {expiresIn: '24h'})

        await refreshTokens.addOrUpdateToken(dataRefreshToken)

        return refreshToken
    },


    ////////////////////////////////////
    async getInfoByToken(refreshToken: string): Promise<{ userId: string, deviceId: string } | null> {
        try {
            const decoded = jwt.verify(refreshToken, settings.JWT_SECRET) as RefreshJWT

            // const result = await refreshTokens.findToken(decoded.deviceId, decoded.issuedAt)
            // if (!result) {
            //     return null
            // }

            return {
                userId: decoded.userId,
                deviceId: decoded.deviceId,
            }

        } catch (e) {
            return null
        }
    },


    ////////////////////////////////////
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, settings.JWT_SECRET) as AuthJWT
            return result.userId
        } catch (e) {
            return null
        }
    },


    ////////////////////////////////////
    async killSessionByToken(token: string): Promise<Boolean> {
        try {
            const decoded = jwt.verify(token, settings.JWT_SECRET) as RefreshJWT

            const result = await refreshTokens.findToken(decoded.deviceId, decoded.issuedAt)
            if (!result) {
                return false
            }

            return await refreshTokens.deleteByDeviceId(decoded.deviceId)

        } catch (e) {
            return false
        }
    },

}