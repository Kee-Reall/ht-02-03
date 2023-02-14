import {inject, injectable} from "inversify";
import {CommentsViewModel, CommentCreationModel, CommentsDbModel, CommentsOutputModel} from "../models/commentsModel";
import {QueryRepository} from "../repositories/queryRepository";
import {CommandRepository} from "../repositories/commandRepository";
import {SearchConfiguration} from "../models/searchConfiguration";
import {IdCreatorFunction, sortingDirection} from "../models/mixedModels";
import { CommentsFilter } from "../models/filtersModel";
import { GetOutput } from "../models/ResponseModel";


@injectable()
export class CommentsService {
    constructor(
        @inject(QueryRepository)protected queryRepository: QueryRepository,
        @inject(CommandRepository)protected commandRepository: CommandRepository,
        @inject<IdCreatorFunction>('idGenerator') protected generateId: IdCreatorFunction

        ) {}

    async createComment (input: CommentCreationModel): Promise<CommentsViewModel | null> {
        const createdAt = new Date(Date.now()).toISOString()
        const { content, postId, user: { id: userId, login: userLogin }} = input
        const id = this.generateId("comment")
        const comment: CommentsViewModel = {createdAt, content, userId , userLogin}
        const toPut: CommentsDbModel = {id,postId, ...comment}
        const result = await this.commandRepository.createComment(toPut)
        return result ? await this.getCommentById(id) : null
    }

    async getCommentById(id: string): Promise<CommentsViewModel | null> {
        return await this.queryRepository.getCommentById(id)
    }
    async updateCommentAfterMiddleware({ id }: CommentsOutputModel, content: string): Promise<boolean> {
        return  await this.commandRepository.updateComment(id,content)
    }

    async deleteCommentAfterMiddleware(id: string) {
        return await this.commandRepository.deleteComment(id)
    }

    async getCommentsByPost(params: CommentsFilter): Promise<GetOutput> {
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
        const items: CommentsOutputModel[] = await this.queryRepository.getCommentsByPostId(searchConfig) ?? []
        return {
            totalCount,
            page: params.pageNumber!,
            pageSize: params.pageSize!,
            pagesCount : Math.ceil(totalCount / params.pageSize!),
            items
        }
    }
}