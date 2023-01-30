import {blogInputModel, blogViewModel} from "../models/blogModel";
import {postInputModel, postViewModel} from "../models/postsModel";
import {blogs, comments, posts, tokens, users} from "../adapters/mongoConnectorCreater";
import {confirmation, userLogicModel, userUpdateTokenModel} from "../models/userModel";
import {commentsDbModel} from "../models/commentsModel";
import {
    refreshTokenDbResponse,
    refreshTokenPayload,
    sessionFilter,
    updateRefreshTokenMeta
} from "../models/refreshTokensMeta";
import {createTokenClientMeta} from "../models/mixedModels";
import {generateDeviceId} from "../helpers/generateDeviceId";

class CommandRepository {

    constructor(
        private genDeviceId: () => string
    ) {}

    private readonly emptyObject = {}

    async createBlog(blog: blogViewModel): Promise<boolean> {
        try {
            const insert = await blogs.insertOne(blog)
            return insert.acknowledged
        } catch (e) {
            return false
        }
    }

    async updateBlog(id: string, updatedFields: blogInputModel): Promise<boolean> {
        try {
            const {modifiedCount} = await blogs.updateOne({id}, {$set: updatedFields})
            return modifiedCount > 0
        } catch (e) {
            return false
        }
    }

    async deleteBlog(id: string): Promise<boolean> {
        try {
            const {deletedCount} = await blogs.deleteOne({id})
            return deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createPost(post: postViewModel): Promise<boolean> {
        try {
            const result = await posts.insertOne(post)
            return result.acknowledged
        } catch (e) {
            return false
        }
    }

    async updatePost(id: string, updateFields: postInputModel): Promise<boolean> {
        try {
            const {modifiedCount} = await posts.updateOne({id}, {$set: updateFields})
            return modifiedCount > 0
        } catch (e) {
            return false
        }
    }

    async deletePost(id: string): Promise<boolean> {
        try {
            const {deletedCount} = await posts.deleteOne({id})
            return deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createUser(user: userLogicModel): Promise<boolean> {
        try {
            const {acknowledged} = await users.insertOne(user)
            return acknowledged
        } catch (e) {
            return false
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await users.deleteOne({id})
            return result.deletedCount !== 0
        } catch (e) {
            return false
        }
    }

    async confirmUser(id: string): Promise<boolean> {
        try {
            const {modifiedCount} = await users.updateOne({id},
                {$set:{
                    "confirmation.isConfirmed":true
                }}
            )
            return modifiedCount > 0
        } catch (e) {
            return false
        }
    }

    async changeCurrentToken(dataSet: userUpdateTokenModel): Promise<boolean> {
        try {
            const {id, nextToken, previousToken} = dataSet
            const {modifiedCount} = await users.updateOne({id},{
                $set:{"refreshTokens.current" : nextToken},
                $push:{"refreshTokens.expired": previousToken}
            })
            return modifiedCount > 0
        } catch (e) {
            return false
        }
    }

    async changeConfirm(id: string, confirmation: confirmation): Promise<boolean> {
        try {
            const {modifiedCount} = await users.updateOne({id},{$set:{confirmation}})
            return modifiedCount > 0
        } catch (e) {
            return false
        }
    }

    async clearStore(): Promise<void> {
        await Promise.all([
            posts.deleteMany(this.emptyObject),
            blogs.deleteMany(this.emptyObject),
            users.deleteMany(this.emptyObject),
            comments.deleteMany(this.emptyObject)
        ])
    }

    async createComment(commentDb: commentsDbModel): Promise<boolean> {
        try {
            const {acknowledged} = await comments.insertOne(commentDb)
            return acknowledged
        } catch (e) {
            return false
        }
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        try {
            const { acknowledged: flag } = await comments.updateOne({id},{$set:{content}})
            return flag
        } catch (e) {
            return false
        }
    }

    async deleteComment(id: string): Promise<boolean> {
        try {
            const { deletedCount } = await comments.deleteOne({id})
            return deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createMetaToken(input: createTokenClientMeta): Promise<refreshTokenDbResponse | null> {
        try {
            const {deviceInfo = null, ip: initialIp, userId} = input
            const ip = [(initialIp ?? 'undetected')]
            const [updateDate, deviceId] = [new Date(Date.now()),this.genDeviceId()]
            const {acknowledged} = await tokens.insertOne({userId, ip, deviceInfo, updateDate, deviceId})
            if(!acknowledged) {
                return null
            }
            return {updateDate,deviceId}
        } catch (e) {
            return null
        }
    }

    async updateMetaToken(input: updateRefreshTokenMeta): Promise<Partial<refreshTokenPayload> | null> {
        try {
            const {deviceId, userId} = input
            const updateDate = new Date(Date.now())
            const {modifiedCount} = await tokens.updateOne({userId,deviceId}, {
                $set:{updateDate},
                $push:{ip: input.ip ?? 'undetected'}
            })
            const toReturn = {
                deviceId,userId,
                updateDate: updateDate.toISOString()
            }
            return modifiedCount > 0 ? toReturn : null
        } catch (e) {
            return null
        }
    }

    async killMetaToken(filter: sessionFilter): Promise<boolean> {
        try {
            const {deletedCount} = await tokens.deleteOne(filter)
            return deletedCount > 0
        } catch (e) {
            return false
        }
    }
}

const commandRepository = new CommandRepository(generateDeviceId)
export { commandRepository }