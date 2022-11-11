import {dbDemo} from "./db";
import {ExtendedLikesInfoViewModel, LikesDetailsViewModel} from "../types/posts";


export type PostLikesDBType = {
    _id: string,
    postId: string,
    likeStatus: string,
    userId: string,
    userLogin: string,
    addedAt: string,
}


const PostLikesCollection = dbDemo.collection<PostLikesDBType>('postLikes')

export const PostLikes = {

    ////////////////////////////////////////////////////////
    async clearAll(): Promise<void> {
        await PostLikesCollection.deleteMany({})
    },


    //////////////////////////////////////////////////
    async deleteByPostID(postId: string): Promise<Boolean> {
        const result = await PostLikesCollection.deleteMany({postId})
        return result.deletedCount > 0
    },


    //////////////////////////////////////////////////
    async deleteByUserID(userId: string): Promise<Boolean> {
        const result = await PostLikesCollection.deleteMany({userId})
        return result.deletedCount > 0
    },

    //////////////////////////////////////////////////
    async deleteByPostIDUserID(postId: string, userId: string): Promise<Boolean> {
        const result = await PostLikesCollection.deleteOne({postId, userId})
        return result.deletedCount > 0
    },

    //////////////////////////////////////////////////
    // async deleteByID(id: string): Promise<Boolean> {
    //     const result = await PostLikesCollection.deleteOne({id})
    //     return result.deletedCount > 0
    // },


    ////////////////////////////////////////////////////////
    async likesInfoByPostID(postId: string, userId?: string): Promise<ExtendedLikesInfoViewModel> {
        const likesCount = await PostLikesCollection.countDocuments({postId, likeStatus: 'Like'})
        const dislikesCount = await PostLikesCollection.countDocuments({postId, likeStatus: 'Dislike'})
        let myStatus = 'None'
        if (userId) {
            const doc = await PostLikesCollection.findOne({postId, userId})
            if (doc) {
                myStatus = doc.likeStatus
            }
        }
        return {
            likesCount, dislikesCount, myStatus,
            newestLikes: await this.newestLikes(postId, 3)
        }
    },


    ////////////////////////////////////////////////////////
    async newestLikes(postId: string, limit: number): Promise<LikesDetailsViewModel[]> {
        const result = await PostLikesCollection.find({postId, likeStatus: 'Like'}).limit(limit).sort({addedAt: -1}).toArray()
        return result.map(el => ({
            addedAt: el.addedAt,
            userId: el.userId,
            login: el.userLogin,
        }))
    },


    ///////////////////////////////////////////////////////
    async updateLikeByID(postId: string, userId: string, userLogin: string, likeStatus: string): Promise<Boolean> {
        const addedAt = new Date().toISOString()
        const result = await PostLikesCollection.updateOne({postId, userId}, {
            $set: {
                likeStatus,
                userLogin,
                addedAt
            }
        }, {upsert: true})
        return result.modifiedCount === 1 || result.upsertedCount === 1
    },


}
