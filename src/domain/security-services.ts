import {jwtService} from "../aplicarion/jwt-service";
import {refreshTokens} from "../repositories/refreshTokens";

export const SecurityService = {

    /////////////////////////////////////////
    async getAllByUserId(refreshToken: string): Promise<any | null> {
        const dataFromToken = await jwtService.getInfoByToken(refreshToken)
        if (!dataFromToken) {
            return null
        }
        const data = await refreshTokens.getAllByUserId(dataFromToken.userId)
        return data.map(el => ({
            deviceId: el.deviceId,
            lastActiveDate: el.issuedAt,
            ip: el.ip,
            title: el.title,
        }))
    },


    /////////////////////////////////////////
    async deleteAllOtherExcludeCurrentDeviceId(refreshToken: string): Promise<boolean> {
        const dataFromToken = await jwtService.getInfoByToken(refreshToken)
        if (!dataFromToken) {
            return false
        }
        return refreshTokens.deleteAllOtherExcludeDeviceId(dataFromToken.deviceId)

    },


    /////////////////////////////////////////
    async deleteByDeviceId(refreshToken: string, deviceId: string): Promise<number> {
        const dataFromDeviceId = await refreshTokens.findByDeviceId(deviceId)
        const dataFromToken = await jwtService.getInfoByToken(refreshToken)
        if (!dataFromToken) {
            return 401
        }
        if (!dataFromDeviceId) {
            return 404
        }
        if (dataFromToken.userId !== dataFromDeviceId.userId) {
            return 403
        }


        await refreshTokens.deleteByDeviceId(dataFromToken.deviceId)
        return 204
    },

}