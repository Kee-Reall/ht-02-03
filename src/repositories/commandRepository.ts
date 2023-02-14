import {BlogInputModel, BlogViewModel} from "../models/blogModel";
import {PostInputModel, PostViewModel} from "../models/postsModel";
import {Confirmation, Recovery, UserLogicModel} from "../models/userModel";
import {CommentsDbModel} from "../models/commentsModel";
import {
    RefreshTokenDbResponse,
    RefreshTokenPayload,
    SessionFilter,
    UpdateRefreshTokenMeta
} from "../models/refreshTokensMeta";
import {CreateTokenClientMeta} from "../models/mixedModels";
import {inject, injectable} from "inversify";
import {Model} from "mongoose";

@injectable()
export class CommandRepository {

    private readonly emptyObject = {}

    constructor(

        @inject<Model<any>>('BlogModel')private Blogs:  Model<any>,
        @inject<Model<any>>('PostModel') private Posts:  Model<any>,
        @inject<Model<any>>('UserModel') private Users:  Model<any>,
        @inject<Model<any>>('CommentModel') private Comments:  Model<any>,
        @inject<Model<any>>('SessionModel') private Sessions:  Model<any>,
        @inject<Model<any>>('AttemptModel')private Attempts: Model<any>,
        @inject<Function>("deviceIdGenerator") private generateDeviceId: Function
    ) {
    }

    async createBlog(blog: BlogViewModel): Promise<boolean> {
        try {
            const res = await this.Blogs.create(blog)
            return !!res
        } catch (e) {
            return false
        }
    }

    async updateBlog(id: string, updatedFields: BlogInputModel): Promise<boolean> {
        try {
            const doc = await this.Blogs.findOneAndUpdate({id}, updatedFields)
            return !!doc
        } catch (e) {
            return false
        }
    }

    async deleteBlog(id: string): Promise<boolean> {
        try {
            const result = await this.Blogs.deleteOne({id})
            return result.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createPost(post: PostViewModel): Promise<boolean> {
        try {
            const createdPost = await this.Posts.create(post)
            return !!createdPost
        } catch (e) {
            console.log(e ?? 'no message')
            return false
        }
    }

    async updatePost(id: string, updateFields: PostInputModel & { blogName?: string }): Promise<boolean> {
        try {
            const post = await this.Posts.findOneAndUpdate({id}, updateFields)
            return !!post
        } catch (e) {
            return false
        }
    }

    async updateManyPostsByBlogId(blogId: string): Promise<boolean> {
        try {
            const blog = await this.Blogs.findOne({id: blogId})
            if (!blog) return false
            await this.Posts.updateMany({blogId}, {blogName: blog.name})
            return true
        } catch (e) {
            return false
        }
    }

    async deletePost(id: string): Promise<boolean> {
        try {
            const res = await this.Posts.deleteOne({id})
            return res.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createUser(user: UserLogicModel): Promise<boolean> {
        try {
            await this.Users.create(user)
            return true
        } catch (e) {
            return false
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const res = await this.Users.deleteOne({id})
            return res.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async confirmUser(id: string): Promise<boolean> {
        try {
            await this.Users.findOneAndUpdate({id}, {"confirmation.isConfirmed": true})
            return true
        } catch (e) {
            return false
        }
    }

    async changeConfirm(id: string, confirmation: Confirmation): Promise<boolean> {
        try {
            await this.Users.findOneAndUpdate({id}, {confirmation})
            return true
        } catch (e) {
            return false
        }
    }

    async clearStore(): Promise<void> {
        await Promise.all([
            this.Posts.deleteMany(this.emptyObject),
            this.Blogs.deleteMany(this.emptyObject),
            this.Users.deleteMany(this.emptyObject),
            this.Comments.deleteMany(this.emptyObject),
            this.Sessions.deleteMany(this.emptyObject),
            this.Attempts.deleteMany(this.emptyObject)
        ])
    }

    async createComment(commentDb: CommentsDbModel): Promise<boolean> {
        try {
            await this.Comments.create(commentDb)
            return true
        } catch (e) {
            return false
        }
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        try {
            await this.Comments.findOneAndUpdate({id}, {content})
            return true
        } catch (e) {
            return false
        }
    }

    async deleteComment(id: string): Promise<boolean> {
        try {
            const res = await this.Comments.deleteOne({id})
            return res.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createMetaToken(input: CreateTokenClientMeta): Promise<RefreshTokenDbResponse | null> {
        try {
            const {title, ip: initialIp, userId} = input
            const ip = [(initialIp ?? 'undetected')]
            const [updateDate, deviceId] = [new Date(Date.now()), this.generateDeviceId()]
            await this.Sessions.create({userId, ip, title, updateDate, deviceId})
            return {updateDate, deviceId}
        } catch (e) {
            return null
        }
    }

    async updateMetaToken(input: UpdateRefreshTokenMeta): Promise<Partial<RefreshTokenPayload> | null> {
        try {
            const {deviceId, userId} = input
            const updateDate = new Date(Date.now())
            const session = await this.Sessions.findOne({userId, deviceId})
            if (!session) return null
            session.updateDate = updateDate
            session.ip.push(input.ip ?? 'undetected')
            session.save()
            return {deviceId, userId, updateDate: updateDate.toISOString()}
        } catch (e) {
            return null
        }
    }

    async killMetaToken(filter: SessionFilter): Promise<boolean> {
        try {
            const res = await this.Sessions.deleteOne(filter)
            return res.deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async killSessionsForUser(userId: string, exclude: string): Promise<boolean> {
        try {
            await this.Sessions.deleteMany({userId, deviceId: {$ne: exclude}})
            return true
        } catch (e) {
            return false
        }
    }

    async recoverAttempt(email: string, recovery: Recovery): Promise<UserLogicModel | null> {
        try {
            return await this.Users.findOneAndUpdate({email}, {recovery})
        } catch (e) {
            console.log('attempt to recover not-existing email')
            return null
        }
    }

    async changeUserPassword(id: string, hash: string, salt: string): Promise<boolean> {
        try {
            await this.Users.findOneAndUpdate({id}, {hash, salt})
            return true
        } catch (e) {
            return false
        }
    }

    async setDefaultRecoveryCode(id: string): Promise<boolean> {
        try {
            await this.Users.findOneAndUpdate({id}, {"recovery.recoveryCode": ''})
            return true
        } catch (e) {
            return false
        }
    }
}