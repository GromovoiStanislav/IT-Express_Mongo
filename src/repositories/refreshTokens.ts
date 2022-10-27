import {dbDemo} from "./db";


export type refreshTokenDBType = {
    deviceId: string,
    userId: string,
    issuedAt: number,
    expiresIn: number,
    ip: string,
}

const TokensCollection = dbDemo.collection<refreshTokenDBType>('refreshTokens')

export const refreshTokens = {

    async clearAll(): Promise<void> {
        await TokensCollection.deleteMany({})
    },

    async getAllByUserId(userId: string): Promise<refreshTokenDBType | null> {
        return TokensCollection.findOne({userId})
    },

    async deleteByDeviceId(deviceId: string): Promise<Boolean> {
        const result = await  TokensCollection.deleteOne({deviceId})
        return result.deletedCount === 1
    },

    async deleteAllOtherExcludeDeviceId(deviceId: string): Promise<Boolean> {
        const result = await  TokensCollection.deleteMany({deviceId}) /// todo
        return result.deletedCount > 0
    },



    async addOrUpdateToken(data: refreshTokenDBType): Promise<Boolean> {
        await TokensCollection.findOneAndUpdate({deviceId:data.deviceId},data,{upsert:true})
        return true
    },

    async findToken(deviceId: string,issuedAt: number): Promise<refreshTokenDBType | null> {
        return TokensCollection.findOne({deviceId,issuedAt})
    },

}