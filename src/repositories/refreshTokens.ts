import {dbDemo} from "./db";


export type refreshTokenDBType = {
    token: string,
}

const TokensCollection = dbDemo.collection<refreshTokenDBType>('refreshTokens')

export const refreshTokens = {

    async clearAll(): Promise<void> {
        await TokensCollection.deleteMany({})
    },

    async addNewToken(token: string): Promise<Boolean> {
        await TokensCollection.insertOne({token})
        return true
    },

    async findToken(token: string): Promise<refreshTokenDBType|null> {
        return TokensCollection.findOne({token})
    },

}