import {FilterQuery} from "mongoose";
import {injectable} from "inversify";
import {blogViewModel} from "../models/blogModel";
import {postViewModel} from "../models/postsModel";
import {Blogs, Posts, Users, Comments, Sessions} from "../adapters/mongooseCreater";
import {SearchConfiguration} from "../models/searchConfiguration";
import {userLogicModel, userViewModel} from "../models/userModel";
import {commentsDbModel, commentsOutputModel} from "../models/commentsModel";
import {refreshTokensMeta, sessionFilter} from "../models/refreshTokensMeta";
import {securityViewModel} from "../models/SecurityModel";

@injectable()
export class QueryRepository {
    //private readonly noHiddenId = {projection: {_id: false}}; deprecated projection for mongo driver
    // private readonly commentProjection = {projection: {_id: false, postId: false}}
    // private readonly userProjection = {
    //     projection: {
    //         _id: false, hash: false, salt: false, confirmation: false
    //     }
    //}
    private readonly all = {};
    private readonly viewSelector = '-_id -__v'
    private readonly userViewSelector = this.viewSelector + ' ' + '-hash -salt -confirmation -recovery'
    private readonly commentSelector = this.viewSelector + ' ' + '-postId'

    async getBlogsCount(filter: string): Promise<number> {
        try {
            return await Blogs.count({
                name: new RegExp(filter, 'ig')
            })
        } catch (e) {
            return 0
        }
    }

    async getPostsCount(filter: any = this.all): Promise<number> {
        try {
            return await Posts.count(filter)
        } catch (e) {
            return 0
        }
    }

    async getBlogWithPagination(config: SearchConfiguration<blogViewModel>): Promise<blogViewModel[] | null> {
        try {
            const filter = config.filter!.name ? {name: new RegExp(config.filter!.name as string, 'i')} : {} //if filter.name does not exist set all
            const direction: 1 | -1 = config.sortDirection! === 'asc' ? 1 : -1
            return await Blogs.find(filter)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getBlogById(id: string): Promise<blogViewModel | null> {
        try {
            return await Blogs.findOne({id}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getPost(id: string): Promise<postViewModel | null> {
        try {
            return await Posts.findOne({id}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getPostsWithPagination(config: SearchConfiguration<postViewModel>) {
        const direction: 1 | -1 = config.sortDirection! === 'asc' ? 1 : -1
        try {
            return await Posts.find(this.all)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getPostsByFilter(config: SearchConfiguration<postViewModel>): Promise<postViewModel[] | null> {
        try {
            const sorter: any = {[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1}
            return await Posts.find(config.filter as FilterQuery<postViewModel>)
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
            return await Users.count(config)
        } catch (e) {
            return 0
        }
    }

    async getUsers(config: any): Promise<userViewModel[] | null> {
        try {
            const direction: 1 | -1 = config.sortDirection === 'asc' ? 1 : -1
            return await Users.find(config.filter)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.userViewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserById(id: string): Promise<userViewModel | null> {
        try {
            return await Users.findOne({id}).select(this.userViewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByIdWithLogic(id: string): Promise<userLogicModel | null> {
        try {
            return await Users.findOne({id}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByLogin(login: string): Promise<userViewModel | null> {
        try {
            return await Users.findOne({login}).select(this.userViewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByEmail(email: string): Promise<userLogicModel | null> {
        try {
            return await Users.findOne({email}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByLoginOrEmail(loginOrEmail: string): Promise<userLogicModel | null> {
        try {
            return await Users.findOne({
                $or: [
                    {login: loginOrEmail},
                    {email: loginOrEmail}
                ]
            }).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByConfirm(code: string): Promise<userLogicModel | null> {
        try {
            return await Users.findOne({"confirmation.code": code}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByRecoveryCode(recoveryCode: string): Promise<userLogicModel | null> {
        try {
            return await Users.findOne({"recovery.recoveryCode": recoveryCode})
        } catch (e) {
            return null
        }
    }

    async getCommentById(id: string): Promise<commentsOutputModel | null> {
        try {
            return await Comments.findOne({id}).select(this.commentSelector)
        } catch (e) {
            return null
        }
    }

    async countCommentsByPostId(postId: string): Promise<number> {
        try {
            return await Comments.count({postId})
        } catch (e) {
            return 0
        }
    }

    async getCommentsByPostId(config: SearchConfiguration<commentsDbModel>): Promise<commentsOutputModel[] | null> {
        try {
            return await Comments.find({postId: config.filter!.postId})
                .sort({[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.commentSelector)
        } catch (e) {
            return null
        }
    }

    async getMetaToken(data: sessionFilter): Promise<refreshTokensMeta | null> {
        const {userId, deviceId} = data
        return await Sessions.findOne({userId, deviceId})
    }

    async getSession(deviceId: string): Promise<refreshTokensMeta | null> {
        return await Sessions.findOne({deviceId})
    }

    async getTokensForUser(userId: string): Promise<Array<securityViewModel>> {
        const arrayFromDb = await Sessions.find({userId})
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