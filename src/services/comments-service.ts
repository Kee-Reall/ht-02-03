import {inject, injectable} from "inversify";
import {CommentsLogicModel, CommentCreationModel, CommentsDbModel, CommentsOutputModel} from "../models/commentsModel";
import {QueryRepository} from "../repositories/queryRepository";
import {CommandRepository} from "../repositories/commandRepository";
import {SearchConfiguration} from "../models/searchConfiguration";
import {IdCreatorFunction, sortingDirection} from "../models/mixedModels";
import {CommentsFilter} from "../models/filtersModel";
import {GetOutput} from "../models/ResponseModel";
import {LikeDTO, LikeModel, WithLike} from "../models/LikeModel";
import {SearchError} from "../helpers/extendedErrors";
import {message} from "../enums/messageEnum";

@injectable()
export class CommentsService {
    constructor(
        @inject(QueryRepository) protected queryRepository: QueryRepository,
        @inject(CommandRepository) protected commandRepository: CommandRepository,
        @inject<IdCreatorFunction>('idGenerator') protected generateId: IdCreatorFunction
    ) {
    }

    public async createComment(input: CommentCreationModel): Promise<CommentsLogicModel | null> {
        const createdAt = new Date(Date.now()).toISOString()
        const {content, postId, user: {id: userId, login: userLogin}} = input
        const id = this.generateId("comment")
        const commentatorInfo = {userId,userLogin}
        const comment: CommentsDbModel = {id, postId,createdAt, content, commentatorInfo}
        const result = await this.commandRepository.createComment(comment)
        return result ? await this.getCommentById(id,userId) : null
    }

    public async getCommentById(id: string,userId: string | null): Promise<WithLike<CommentsLogicModel> | null> {
        const comment = await this.queryRepository.getCommentById(id)
        if (!comment) return null
        const likesInfo = await this.queryRepository.getLikeStatus(id,userId)
        return {
            ...comment,
            likesInfo
        }
    }

    public async updateCommentAfterMiddleware({id}: CommentsOutputModel, content: string): Promise<boolean> {
        return await this.commandRepository.updateComment(id, content)
    }

    public async deleteCommentAfterMiddleware(id: string) {
        return await this.commandRepository.deleteComment(id)
    }

    public async getCommentsByPost(params: CommentsFilter,userId: string | null): Promise<GetOutput> {
        const searchConfig: SearchConfiguration<CommentsDbModel> = {
            filter: {
                postId: params.searchId
            },
            sortDirection: params.sortDirection as sortingDirection,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1),
            sortBy: params.sortBy as string,
            limit: params.pageSize as number
        }
        const totalCount = await this.queryRepository.countCommentsByPostId(searchConfig.filter!.postId as string)
        const items: CommentsOutputModel[] = await this.queryRepository.getCommentsByPostId(searchConfig,userId) ?? []
        return {
            totalCount,
            page: params.pageNumber!,
            pageSize: params.pageSize!,
            pagesCount: Math.ceil(totalCount / params.pageSize!),
            items
        }
    }

    private async createLikeEntity(target: string, {likeStatus, userId}: LikeDTO): Promise<LikeModel> {
        const user = await this.queryRepository.getUserById(userId)
        return {
            login: user!.login, likeStatus, userId, target,
            addAt: new Date(),
            id: this.generateId('like'),
        }
    }

    public async likeComment(commentId: string, dto: LikeDTO): Promise<boolean> {
        const comment = await this.queryRepository.getCommentById(commentId)
        if (!comment) {
            throw new SearchError('comment', message.notExist)
        }
        const like = await this.queryRepository.getLikeByUserToTarget(dto.userId, commentId)
        if (!like) {
            return  await this.commandRepository.createLike(await this.createLikeEntity(commentId, dto))
        }
        if (dto.likeStatus === like.likeStatus) {
            return true
        }
        return await this.commandRepository.updateLike(commentId,dto.userId,dto.likeStatus)
    }
}