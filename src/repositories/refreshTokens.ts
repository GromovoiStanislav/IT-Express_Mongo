import {dbDemo} from "./db";


export type refreshTokenDBType = {
    deviceId: string,
    userId: string,
    issuedAt: string,
    expiresIn: string,
    ip: string,
    title: string,
}

const TokensCollection = dbDemo.collection<refreshTokenDBType>('refreshTokens')

export const refreshTokens = {

    async clearAll(): Promise<void> {
        await TokensCollection.deleteMany({})
    },

    async getAllByUserId(userId: string): Promise<refreshTokenDBType[]> {
        return TokensCollection.find({userId}).toArray()
    },

    async deleteByDeviceId(deviceId: string): Promise<Boolean> {
        const result = await TokensCollection.deleteOne({deviceId})
        return result.deletedCount === 1
    },

    async deleteAllOtherExcludeDeviceId(deviceId: string,userId:string): Promise<boolean> {
        const result = await TokensCollection.deleteMany({userId,deviceId: { $ne: deviceId }}) /// todo
        return result.deletedCount > 0
    },


    async addOrUpdateToken(data: refreshTokenDBType): Promise<boolean> {
        await TokensCollection.findOneAndReplace({deviceId: data.deviceId}, data, {upsert: true})
        return true
    },

    async findToken(deviceId: string, issuedAt: string): Promise<refreshTokenDBType | null> {
        return TokensCollection.findOne({deviceId, issuedAt})
    },

    async findByDeviceId(deviceId: string): Promise<refreshTokenDBType | null> {
        return TokensCollection.findOne({deviceId})
    },
}