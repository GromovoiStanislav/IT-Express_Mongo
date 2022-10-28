import {jwtService} from "../aplicarion/jwt-service";
import {refreshTokens} from "../repositories/refreshTokens";

export const SecurityService = {

     async getAllByUserId(refreshToken:string): Promise<any | null>{
         const userId = await jwtService.getUserIdByToken(refreshToken)
         if (!userId) {
             return null
         }
         const data = await refreshTokens.getAllByUserId(userId)
         return data.map(el=>({
             ip: el._id,
             title: el.title,
             lastActiveDate: el.issuedAt,
             deviceId: el.deviceId,
         }))
     },




}