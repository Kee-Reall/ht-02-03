import {Model, FilterQuery, LeanDocument} from "mongoose";
import {inject, injectable} from "inversify";
import {BlogViewModel} from "../models/blogModel";
import {PostViewModel} from "../models/postsModel";
import {DirectionNum, SearchConfiguration} from "../models/searchConfiguration";
import {UserLogicModel, UserViewModel} from "../models/userModel";
import {CommentsDbModel, CommentsOutputModel} from "../models/commentsModel";
import {RefreshTokensMeta, SessionFilter} from "../models/refreshTokensMeta";
import {SecurityViewModel} from "../models/SecurityModel";
import {
    ExtendedLikesInfo,
    LikeModel,
    LikesInfo,
    LikeStatus,
    WithExtendedLike,
    WithLike
} from "../models/LikeModel";
import {WithId} from "mongodb"
import {likeEnum} from "../enums/likeEnum";
import {Likes} from "../adapters/mongooseCreater";
import {Nullable, NullablePromise} from "../models/mixedModels";
import {likesInfo} from "../helpers/mongoPipelineStorage";

@injectable()
export class QueryRepository {

    /* Projections objects for native mongo driver now its deprecated*/
    //private readonly noHiddenId = {projection: {_id: false}}; deprecated projection for mongo driver
    // private readonly commentProjection = {projection: {_id: false, postId: false}}
    // private readonly userProjection = {
    //     projection: {
    //         _id: false, hash: false, salt: false, confirmation: false
    //     }
    //}
    /*end of projections*/
    private readonly all = {};
    private readonly viewSelector = '-_id -__v'
    private readonly lastLikesSelector = 'addedAt login userId -_id'
    private readonly userViewSelector = this.viewSelector + ' ' + '-hash -salt -confirmation -recovery'
    private readonly commentSelector = this.viewSelector + ' ' + '-postId'

    constructor(
        @inject<Model<any>>('BlogModel') private Blogs: Model<any>,
        @inject<Model<any>>('PostModel') private Posts: Model<any>,
        @inject<Model<any>>('UserModel') private Users: Model<any>,
        @inject<Model<any>>('CommentModel') private Comments: Model<any>,
        @inject<Model<any>>('SessionModel') private Sessions: Model<any>,
        @inject<Model<any>>("LikeModel") private Likes: Model<any>
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

    async getBlogWithPagination(config: SearchConfiguration<BlogViewModel>): NullablePromise<BlogViewModel[]> {
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

    async getBlogById(id: string): NullablePromise<BlogViewModel> {
        try {
            return await this.Blogs.findOne({id}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getPost(id: string): NullablePromise<PostViewModel> {
        try {
            return await this.Posts.findOne({id}).select(this.viewSelector).lean()
        } catch (e) {
            return null
        }
    }

    public async getPostsWithPagination(config: SearchConfiguration<PostViewModel>, userId: Nullable<string>): NullablePromise<WithExtendedLike<PostViewModel>[]> {
        try {
            const posts = await this.Posts.aggregate(likesInfo(config,userId))
            return posts
            // const posts = await this.Posts.find(this.all)
            //     .sort({[config.sortBy]: direction})
            //     .skip(config.shouldSkip)
            //     .limit(config.limit)
            //     .select(this.viewSelector)
            //     .lean()
            // const idArray = posts.map(el => el.id)
            // const likeStatuses: LikesInfo[] = await this.getLikesInfoForMany(idArray, userId)
            // return await Promise.all(posts.map(async (post, i) => {
            //     return {
            //         ...post as PostViewModel,
            //         extendedLikesInfo: {
            //             ...likeStatuses[i],
            //             newestLikes: await this.getLastLikes(post.id)
            //         }
            //     }
            // }))
        } catch (e) {
            console.log(e)
            //@ts-ignore
            console.log(e.message)
            console.log("inside catch")
            return null
        }
    }

    // private async getLastLikesArray(targetIds: string[]): Promise<Array<NewestLikeArray>> { // it blows my mind. fix this later
    //     try {
    //         const herb: Array<NewestLikeArrayWithTarget> = await this.Likes
    //             .find({target: {$in: targetIds}, likeStatus: likeEnum.like})
    //             .sort({addedAt: -1})
    //             .select(this.lastLikesSelector + ' target')
    //             .lean()
    //         const starter: Array<NewestLikeArray> = new Array(targetIds.length).fill([])
    //         console.log(starter)
    //         const finisher: Array<NewestLikeArray> = await Promise.all(starter.map(async (_, i) => {
    //             const lastLikes: NewestLikeArray = []
    //                 for (let j = 0; j < herb.length; j++) {
    //                     console.log(herb[j].target === targetIds[i])
    //                     if(lastLikes.length === 3) break
    //                     if (herb[j].target === targetIds[i]) {
    //                             lastLikes.push({userId: herb[j].userId, login: herb[j].login, addedAt: herb[j].addedAt})
    //                             herb.splice(j,1)
    //                             j--
    //
    //                     }
    //                 }
    //                 return lastLikes
    //             }))
    //         console.log(finisher)
    //         return finisher
    //     } catch (e) {
    //         return []
    //     }
    // }

    async getPostsByFilter(config: SearchConfiguration<PostViewModel>, userId: Nullable<string> = null): NullablePromise<WithExtendedLike<PostViewModel>[]> {
        try {
            const sorter: any = {[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1}
            const posts = await this.Posts.find(config.filter as FilterQuery<PostViewModel>)
                .sort(sorter)
                .skip(config.shouldSkip)
                .limit(config.limit)
                .select(this.viewSelector)
                .lean()
            const idArray = posts.map(el => el.id)
            const likeStatuses: LikesInfo[] = await this.getLikesInfoForMany(idArray, userId)
            return await Promise.all(posts.map(async (post, i) => {
                return {
                    ...post as PostViewModel,
                    extendedLikesInfo: {
                        ...likeStatuses[i],
                        newestLikes: await this.getLastLikes(post.id)
                    }
                }
            }))
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

    async getUsers(config: any): NullablePromise<UserViewModel[]> {
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

    async getUserById(id: string): NullablePromise<UserViewModel> {
        try {
            return await this.Users.findOne({id}).select(this.userViewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByIdWithLogic(id: string): NullablePromise<UserLogicModel> {
        try {
            return await this.Users.findOne({id}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByLogin(login: string): NullablePromise<UserViewModel> {
        try {
            return await this.Users.findOne({login}).select(this.userViewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByEmail(email: string): NullablePromise<UserLogicModel> {
        try {
            return await this.Users.findOne({email}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByLoginOrEmail(loginOrEmail: string): NullablePromise<UserLogicModel> {
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

    async getUserByConfirm(code: string): NullablePromise<UserLogicModel> {
        try {
            return await this.Users.findOne({"confirmation.code": code}).select(this.viewSelector)
        } catch (e) {
            return null
        }
    }

    async getUserByRecoveryCode(recoveryCode: string): NullablePromise<UserLogicModel> {
        try {
            return await this.Users.findOne({"recovery.recoveryCode": recoveryCode})
        } catch (e) {
            return null
        }
    }

    private async _commentMutator<T extends CommentsDbModel>(comment: T): Promise<CommentsOutputModel> {
        return {
            id: comment.id,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt
        }
    }

    public async getCommentById(id: string): NullablePromise<CommentsOutputModel> {
        try {
            const comment = await this.Comments.findOne({id}).select(this.commentSelector)
            if (!comment) return null
            return await this._commentMutator(comment)
        } catch (e) {
            return null
        }
    }

    public async countCommentsByPostId(postId: string): Promise<number> {
        try {
            return await this.Comments.count({postId})
        } catch (e) {
            return 0
        }
    }

    public async getCommentsByPostId(config: SearchConfiguration<CommentsDbModel>, userId: Nullable<string>): NullablePromise<WithLike<CommentsOutputModel>[]> {
        try {
            return await this.Comments.aggregate(likesInfo(config,userId))
            // const comments: LeanDocument<CommentsOutputModel>[] = await this.Comments.find({postId: config.filter!.postId})
            //     .sort({[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1})
            //     .skip(config.shouldSkip)
            //     .limit(config.limit)
            //     .select(this.commentSelector)
            //     .lean()
            // const result = await this.getLikesInfoForMany(comments.map(comment => comment.id), userId)
            // return comments.map((comment, i) => {
            //     return {
            //         ...comment,
            //         likesInfo: result[i] as LikesInfo
            //     }
            // })
        } catch (e) {
            return null
        }
    }

    private async incrementLikeReducer(reducer: LikesInfo): Promise<void> {
        reducer.likesCount += 1
    }

    private async incrementDislikeReducer(reducer: LikesInfo): Promise<void> {
        reducer.dislikesCount += 1
    }

    private async setStatusForLikesInfoReducer(reducer: LikesInfo, status: LikeStatus): Promise<void> {
        reducer.myStatus = status
    }

    // private async getLastLikesForMany(targetIds: string[]): Promise<LastLikes[]> {
    //     try {
    //         const ar: LastLikes[] =
    //         return []
    //     } catch (e) {
    //         return[]
    //     }
    //
    // }

    private async getLikesInfoForMany(targetIds: string[], userId: Nullable<string> = null): Promise<LikesInfo[]> {
        try {
            const likes: Pick<LikeModel, 'likeStatus' | 'target' | 'userId'>[] = await this.Likes.find({
                target: {$in: targetIds}
            }).select('likeStatus target userId -_id').lean()
            return Promise.all(targetIds.map(async (id) => {
                const reducer: LikesInfo = {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: likeEnum.none
                }
                for (let like of likes) {
                    if (id === like.target) {
                        if (like.likeStatus === likeEnum.like) {
                            await this.incrementLikeReducer(reducer)
                        } else if (like.likeStatus === likeEnum.dislike) {
                            await this.incrementDislikeReducer(reducer)
                        }
                        if (like.userId === userId) {
                            await this.setStatusForLikesInfoReducer(reducer, like.likeStatus)
                        }
                    }
                }
                return reducer
            }))
        } catch (e) {
            return []
        }
    }

    public async getMetaToken(data: SessionFilter): NullablePromise<RefreshTokensMeta> {
        const {userId, deviceId} = data
        return await this.Sessions.findOne({userId, deviceId})
    }

    public async getSession(deviceId: string): NullablePromise<RefreshTokensMeta> {
        try {
            return await this.Sessions.findOne({deviceId})
        } catch (e) {
            return null
        }
    }

    public async getTokensForUser(userId: string): NullablePromise<Array<SecurityViewModel>> {
        try {
            const arrayFromDb = await this.Sessions.find({userId})
            return arrayFromDb.map(({ip, deviceId, title, updateDate,}) => {
                return {
                    ip: ip[ip.length - 1] as string,
                    lastActiveDate: updateDate.toISOString(),
                    deviceId,
                    title: title as string
                }
            })
        } catch (e) {
            return null
        }
    }

    public async getLikeByUserToTarget(userId: string, target: string): NullablePromise<WithId<LikeModel>> {
        try {
            return await this.Likes.findOne({userId, target})
        } catch (e) {
            return null
        }
    }

    public async getLikeById(id: string): NullablePromise<LikeModel> { // Nothing use this for this moment
        try {
            return await this.Likes.findOne({id})
        } catch (e) {
            return null
        }
    }

    public async getLikeCount(target: string): Promise<number> {
        try {
            return await this.Likes.countDocuments({
                target, likeStatus: likeEnum.like
            })
        } catch (e) {
            return 0
        }
    }

    public async getDislikeCount(target: string): Promise<number> {
        try {
            return await this.Likes.countDocuments({
                target, likeStatus: likeEnum.dislike
            })
        } catch (e) {
            return 0
        }
    }

    public async getUserLikeStatus(target: string, userId: Nullable<string>): Promise<LikeStatus> {
        try {
            if (!userId) return likeEnum.none
            const like = await this.Likes.findOne({target, userId})
            if (!like) return likeEnum.none
            return like.likeStatus
        } catch (e) {
            return likeEnum.none
        }
    }

    public async getLikeInfo(target: string, userId: Nullable<string>): Promise<LikesInfo> {
        try {
            const [likesCount, dislikesCount, myStatus] = await Promise.all([
                this.getLikeCount(target),
                this.getDislikeCount(target),
                this.getUserLikeStatus(target, userId)
            ])
            return {likesCount, dislikesCount, myStatus}
        } catch (e) {
            const [likesCount, dislikesCount, myStatus] = [0, 0, likeEnum.none]
            return {likesCount, dislikesCount, myStatus}
        }
    }

    private async getLastLikes(target: string, limit: number = 3): Promise<Array<Pick<LikeModel, 'login' | 'addedAt' | 'userId'>>> {
        try {
            return await Likes.find({
                target,
                likeStatus: likeEnum.like
            }).sort({addedAt: -1}).limit(limit).select(this.lastLikesSelector).lean()
        } catch (e) {
            return []
        }
    }

    public async getExtendedLikeInfo(target: string, userId: string | null = null): Promise<ExtendedLikesInfo> {
        try {
            return {
                ...await this.getLikeInfo(target, userId),
                newestLikes: await this.getLastLikes(target)
            }
        } catch (e) {
            const [likesCount, dislikesCount, myStatus, newestLikes] = [0, 0, likeEnum.none, []]
            return {likesCount, dislikesCount, myStatus, newestLikes}
        }
    }
}