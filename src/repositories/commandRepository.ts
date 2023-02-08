import {blogInputModel, blogViewModel} from "../models/blogModel";
import {postInputModel, postViewModel} from "../models/postsModel";
import {Attempts, Blogs, Posts, Comments, Users, Sessions} from "../adapters/mongooseCreater";
import {confirmation, recovery, userLogicModel} from "../models/userModel";
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
    ) {
    }

    private readonly emptyObject = {}

    async createBlog(blog: blogViewModel): Promise<boolean> {
        try {
            const res = await Blogs.create(blog)
            return !!res
        } catch (e) {
            return false
        }
    }

    async updateBlog(id: string, updatedFields: blogInputModel): Promise<boolean> {
        try {
            const doc = await Blogs.findOneAndUpdate({id}, updatedFields)
            return !!doc
        } catch (e) {
            return false
        }
    }

    async deleteBlog(id: string): Promise<boolean> {
        try {
            const res = await Blogs.deleteOne({id})
            return res.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createPost(post: postViewModel): Promise<boolean> {
        try {
            const res = await Posts.create(post)
            return !!res
        } catch (e) {
            console.log(e ?? 'no message')
            return false
        }
    }

    async updatePost(id: string, updateFields: postInputModel & {blogName?: string}): Promise<boolean> {
        try {
            const post = await Posts.findOneAndUpdate({id}, updateFields)
            return !!post
        } catch (e) {
            return false
        }
    }

    async updateManyPostsByBlogId(blogId: string): Promise<boolean> {
        try {
            const blog = await Blogs.findOne({id: blogId})
            if (!blog ) return false
            await Posts.updateMany({blogId},{blogName: blog.name})
            return true
        } catch (e) {
            return false
        }
    }

    async deletePost(id: string): Promise<boolean> {
        try {
            const res = await Posts.deleteOne({id})
            return res.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createUser(user: userLogicModel): Promise<boolean> {
        try {
            await Users.create(user)
            return true
        } catch (e) {
            return false
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const res = await Users.deleteOne({id})
            return res.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async confirmUser(id: string): Promise<boolean> {
        try {
            await Users.findOneAndUpdate({id}, {"confirmation.isConfirmed": true})
            return true
        } catch (e) {
            return false
        }
    }

    async changeConfirm(id: string, confirmation: confirmation): Promise<boolean> {
        try {
            await Users.findOneAndUpdate({id}, {confirmation})
            return true
        } catch (e) {
            return false
        }
    }

    async clearStore(): Promise<void> {
        await Promise.all([
            Posts.deleteMany(this.emptyObject),
            Blogs.deleteMany(this.emptyObject),
            Users.deleteMany(this.emptyObject),
            Comments.deleteMany(this.emptyObject),
            Sessions.deleteMany(this.emptyObject),
            Attempts.deleteMany(this.emptyObject)
        ])
    }

    async createComment(commentDb: commentsDbModel): Promise<boolean> {
        try {
            await Comments.create(commentDb)
            return true
        } catch (e) {
            return false
        }
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        try {
            await Comments.findOneAndUpdate({id}, {content})
            return true
        } catch (e) {
            return false
        }
    }

    async deleteComment(id: string): Promise<boolean> {
        try {
            const res = await Comments.deleteOne({id})
            return res.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createMetaToken(input: createTokenClientMeta): Promise<refreshTokenDbResponse | null> {
        try {
            const {title, ip: initialIp, userId} = input
            const ip = [(initialIp ?? 'undetected')]
            const [updateDate, deviceId] = [new Date(Date.now()), this.genDeviceId()]
            await Sessions.create({userId, ip, title, updateDate, deviceId})
            return {updateDate, deviceId}
        } catch (e) {
            return null
        }
    }

    async updateMetaToken(input: updateRefreshTokenMeta): Promise<Partial<refreshTokenPayload> | null> {
        try {
            const {deviceId, userId} = input
            const updateDate = new Date(Date.now())
            const session = await Sessions.findOne({userId, deviceId})
            if (!session) return null
            session.updateDate = updateDate
            session.ip.push(input.ip ?? 'undetected')
            session.save()
            return {deviceId, userId, updateDate: updateDate.toISOString()}
        } catch (e) {
            return null
        }
    }

    async killMetaToken(filter: sessionFilter): Promise<boolean> {
        try {
            const res = await Sessions.deleteOne(filter)
            return res.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async killSessionsForUser(userId: string, exclude: string): Promise<boolean> {
        try {
            await Sessions.deleteMany({userId, deviceId: {$ne: exclude}})
            return true
        } catch (e) {
            return false
        }
    }

    async recoverAttempt(email: string, recovery: recovery): Promise<userLogicModel | null> {
        try {
            return await Users.findOneAndUpdate({email}, {recovery})
        } catch (e) {
            console.log('attempt to recover not-existing email')
            return null
        }
    }

    async changeUserPassword(id: string,hash: string, salt: string): Promise<boolean> {
        try {
            await Users.findOneAndUpdate({id},{hash,salt})
            return true
        } catch (e) {
            return false
        }
    }

    async setDefaultRecoveryCode(id: string): Promise<boolean> {
        try {
            await Users.findOneAndUpdate({id},{"recovery.recoveryCode":''})
            return true
        } catch (e) {
            return false
        }
    }
}

const commandRepository = new CommandRepository(generateDeviceId)
export {commandRepository}