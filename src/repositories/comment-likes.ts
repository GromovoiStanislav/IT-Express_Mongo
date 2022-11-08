import {dbDemo} from "./db";
import {likesInfoViewModel} from "../types/comments";


export type CommentLikesDBType = {
    _id?: string,
    commentId: string,
    likeStatus: string,
    userId: string,
    userLogin: string,
    addedAt: string,
}


const CommentLikesCollection = dbDemo.collection<CommentLikesDBType>('commentLikes')

export const CommentLikes = {

    ////////////////////////////////////////////////////////
    async clearAll(): Promise<void> {
        await CommentLikesCollection.deleteMany({})
    },


    //////////////////////////////////////////////////
    async deleteByCommentID(commentId: string): Promise<Boolean> {
        const result = await CommentLikesCollection.deleteMany({commentId})
        return result.deletedCount > 0
    },


    //////////////////////////////////////////////////
    async deleteByUserID(userId: string): Promise<Boolean> {
        const result = await CommentLikesCollection.deleteMany({userId})
        return result.deletedCount > 0
    },

    //////////////////////////////////////////////////
    async deleteByCommentIDUserID(commentId: string, userId: string): Promise<Boolean> {
        const result = await CommentLikesCollection.deleteOne({commentId, userId})
        return result.deletedCount > 0
    },

    //////////////////////////////////////////////////
    async deleteByID(id: string): Promise<Boolean> {
        const result = await CommentLikesCollection.deleteOne({id})
        return result.deletedCount > 0
    },


    ////////////////////////////////////////////////////////
    async likesByCommentID(commentId: string, userId?: string): Promise<likesInfoViewModel> {
        const likesCount = await CommentLikesCollection.countDocuments({commentId, likeStatus: 'Like'})
        const dislikesCount = await CommentLikesCollection.countDocuments({commentId, likeStatus: 'Dislike'})
        let myStatus = 'None'
        if (userId) {
            const doc = await CommentLikesCollection.findOne({commentId, userId})
            if (doc) {
                myStatus = doc.likeStatus
            }
        }
        return {likesCount, dislikesCount, myStatus}
    },


    ///////////////////////////////////////////////////////
    async updateLikeByID(commentId: string, userId: string, userLogin: string, likeStatus: string): Promise<Boolean> {
        const addedAt = new Date().toISOString()
        const result = await CommentLikesCollection.updateOne({commentId, userId}, {
            $set: {
                likeStatus,
                userId,
                userLogin,
                addedAt
            }
        }, {upsert: true})
        return result.modifiedCount === 1 || result.upsertedCount === 1
        //return true
    },


}
