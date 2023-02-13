import {inject, injectable} from "inversify";
import {commentsViewModel, commentCreationModel, commentsDbModel, commentsOutputModel} from "../models/commentsModel";
import {QueryRepository} from "../repositories/queryRepository";
import {CommandRepository} from "../repositories/commandRepository";
import generateId from "../helpers/generateId";
import {SearchConfiguration} from "../models/searchConfiguration";
import {sortingDirection } from "../models/mixedModels";
import { commentsFilter } from "../models/filtersModel";
import { getOutput } from "../models/ResponseModel";


@injectable()
export class CommentsService {
    constructor(
        @inject(QueryRepository)protected queryRepository: QueryRepository,
        @inject(CommandRepository)protected commandRepository: CommandRepository

        ) {}

    async createComment (input: commentCreationModel): Promise<commentsViewModel | null> {
        const createdAt = new Date(Date.now()).toISOString()
        const { content, postId, user: { id: userId, login: userLogin }} = input
        const id = generateId("comment")
        const comment: commentsViewModel = {createdAt, content, userId , userLogin}
        const toPut: commentsDbModel = {id,postId, ...comment}
        const result = await this.commandRepository.createComment(toPut)
        return result ? await this.getCommentById(id) : null
    }

    async getCommentById(id: string): Promise<commentsViewModel | null> {
        return await this.queryRepository.getCommentById(id)
    }
    async updateCommentAfterMiddleware({ id }: commentsOutputModel, content: string): Promise<boolean> {
        return  await this.commandRepository.updateComment(id,content)
    }

    async deleteCommentAfterMiddleware(id: string) {
        return await this.commandRepository.deleteComment(id)
    }

    async getCommentsByPost(params: commentsFilter): Promise<getOutput> {
        const searchConfig: SearchConfiguration<commentsDbModel> = {
            filter: {
                postId: params.searchId
            },
            sortDirection: params.sortDirection as sortingDirection,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1),
            sortBy: params.sortBy as string,
            limit: params.pageSize as number
        }
        const totalCount = await this.queryRepository.countCommentsByPostId(searchConfig.filter!.postId as string)
        const items: commentsOutputModel[] = await this.queryRepository.getCommentsByPostId(searchConfig) ?? []
        return {
            totalCount,
            page: params.pageNumber!,
            pageSize: params.pageSize!,
            pagesCount : Math.ceil(totalCount / params.pageSize!),
            items
        }
    }
}