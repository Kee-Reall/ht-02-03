import {Model,FilterQuery} from "mongoose";
import {inject, injectable} from "inversify";
import {BlogViewModel} from "../models/blogModel";
import {PostViewModel} from "../models/postsModel";
import {SearchConfiguration} from "../models/searchConfiguration";
import {UserLogicModel, UserViewModel} from "../models/userModel";
import {CommentsDbModel, CommentsOutputModel} from "../models/commentsModel";
import {RefreshTokensMeta, SessionFilter} from "../models/refreshTokensMeta";
import {SecurityViewModel} from "../models/SecurityModel";

@injectable()
export class QueryRepository {

    /* Projections objects for native mongodriver now its deprecated*/
    //private readonly noHiddenId = {projection: {_id: false}}; deprecated projection for mongo driver
    // private readonly commentProjection = {projection: {_id: false, postId: false}}
    // private readonly userProjection = {
    //     projection: {
    //         _id: false, hash: false, salt: false, confirmation: false
    //     }
    //}
    /*end of prohjections*/
    private readonly all = {};
    private readonly viewSelector = '-_id -__v'
    private readonly userViewSelector = this.viewSelector + ' ' + '-hash -salt -confirmation -recovery'
    private readonly commentSelector = this.viewSelector + ' ' + '-postId'

    constructor(
        @inject<Model<any>>('BlogModel') private Blogs:  Model<any>,
        @inject<Model<any>>('PostModel') private Posts:  Model<any>,
        @inject<Model<any>>('UserModel') private Users:  Model<any>,
        @inject<Model<any>>('CommentModel') private Comments:  Model<any>,
        @inject<Model<any>>('SessionModel') private Sessions:  Model<any>
    ) {
    }

    async getBlogsCount(filter: string): Promise<number> {
        try {
            return await this.Blogs.count({
                name: new RegExp(filter, 'ig')
            })
        } catch (e) {
            return 0
        }
    }

    async getPostsCount(filter: any = this.all): Promise<number> {
        try {
            return await this.Posts.count(filter)
        } catch (e) {
            return 0
        }
    }

    async getBlogWithPagination(config: SearchConfiguration<BlogViewModel>): Promise<BlogViewModel[] | null> {
        try {
            const filter = config.filter!.name ? {name: new RegExp(config.filter!.name as string, 'i')} : {} //if filter.name does not exist set all
            const direction: 1 | -1 = config.sortDirection! === 'asc' ? 1 : -1
            return await this.Blogs.find(filter)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getBlogById(id: string): Promise<BlogViewModel | null> {
        try {
            return await this.Blogs.findOne({id}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getPost(id: string): Promise<PostViewModel | null> {
        try {
            return await this.Posts.findOne({id}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getPostsWithPagination(config: SearchConfiguration<PostViewModel>) {
        const direction: 1 | -1 = config.sortDirection! === 'asc' ? 1 : -1
        try {
            return await this.Posts.find(this.all)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getPostsByFilter(config: SearchConfiguration<PostViewModel>): Promise<PostViewModel[] | null> {
        try {
            const sorter: any = {[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1}
            return await this.Posts.find(config.filter as FilterQuery<PostViewModel>)
                .sort(sorter)
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUsersCount(config: any): Promise<number> {
        try {
            return await this.Users.count(config)
        } catch (e) {
            return 0
        }
    }

    async getUsers(config: any): Promise<UserViewModel[] | null> {
        try {
            const direction: 1 | -1 = config.sortDirection === 'asc' ? 1 : -1
            return await this.Users.find(config.filter)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.userViewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserById(id: string): Promise<UserViewModel | null> {
        try {
            return await this.Users.findOne({id}).select(this.userViewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByIdWithLogic(id: string): Promise<UserLogicModel | null> {
        try {
            return await this.Users.findOne({id}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByLogin(login: string): Promise<UserViewModel | null> {
        try {
            return await this.Users.findOne({login}).select(this.userViewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByEmail(email: string): Promise<UserLogicModel | null> {
        try {
            return await this.Users.findOne({email}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserLogicModel | null> {
        try {
            return await this.Users.findOne({
                $or: [
                    {login: loginOrEmail},
                    {email: loginOrEmail}
                ]
            }).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByConfirm(code: string): Promise<UserLogicModel | null> {
        try {
            return await this.Users.findOne({"confirmation.code": code}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByRecoveryCode(recoveryCode: string): Promise<UserLogicModel | null> {
        try {
            return await this.Users.findOne({"recovery.recoveryCode": recoveryCode})
        } catch (e) {
            return null
        }
    }

    async getCommentById(id: string): Promise<CommentsOutputModel | null> {
        try {
            return await this.Comments.findOne({id}).select(this.commentSelector)
        } catch (e) {
            return null
        }
    }

    async countCommentsByPostId(postId: string): Promise<number> {
        try {
            return await this.Comments.count({postId})
        } catch (e) {
            return 0
        }
    }

    async getCommentsByPostId(config: SearchConfiguration<CommentsDbModel>): Promise<CommentsOutputModel[] | null> {
        try {
            return await this.Comments.find({postId: config.filter!.postId})
                .sort({[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.commentSelector)
        } catch (e) {
            return null
        }
    }

    async getMetaToken(data: SessionFilter): Promise<RefreshTokensMeta | null> {
        const {userId, deviceId} = data
        return await this.Sessions.findOne({userId, deviceId})
    }

    async getSession(deviceId: string): Promise<RefreshTokensMeta | null> {
        return await this.Sessions.findOne({deviceId})
    }

    async getTokensForUser(userId: string): Promise<Array<SecurityViewModel>> {
        const arrayFromDb = await this.Sessions.find({userId})
        return arrayFromDb.map(({ip, deviceId, title, updateDate,}) => {
            return {
                ip: ip[ip.length - 1] as string,
                lastActiveDate: updateDate.toISOString(),
                deviceId,
                title: title as string
            }
        })
    }
}