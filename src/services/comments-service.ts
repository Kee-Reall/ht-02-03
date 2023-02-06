import {commentsViewModel, commentCreationModel, commentsDbModel, commentsOutputModel} from "../models/commentsModel";
import {queryRepository} from "../repositories/queryRepository";
import {commandRepository} from "../repositories/commandRepository";
import generateId from "../helpers/generateId";
import {SearchConfiguration} from "../models/searchConfiguration";
import { eternityId, sortingDirection } from "../models/mixedModels";
import { commentsFilter } from "../models/filtersModel";
import { getOutput } from "../models/ResponseModel";

class CommentsService {

    constructor(
        public generateId: (arg: eternityId) => string
        ) {}

    async createComment (input: commentCreationModel): Promise<commentsViewModel | null> {
        const createdAt = new Date(Date.now()).toISOString()
        const { content, postId, user: { id: userId, login: userLogin }} = input
        const id = this.generateId("comment")
        const comment: commentsViewModel = {createdAt, content, userId , userLogin}
        const toPut: commentsDbModel = {id,postId, ...comment}
        const result = await commandRepository.createComment(toPut)
        return result ? await this.getCommentById(id) : null
    }

    async getCommentById(id: string): Promise<commentsViewModel | null> {
        return await queryRepository.getCommentById(id)
    }
    async updateCommentAfterMiddleware({ id }: commentsOutputModel, content: string): Promise<boolean> {
        return  await commandRepository.updateComment(id,content)
    }

    async deleteCommentAfterMiddleware(id: string) {
        return await commandRepository.deleteComment(id)
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
        const totalCount = await queryRepository.countCommentsByPostId(searchConfig.filter!.postId as string)
        const items: commentsOutputModel[] = await queryRepository.getCommentsByPostId(searchConfig) ?? []
        return {
            totalCount,
            page: params.pageNumber!,
            pageSize: params.pageSize!,
            pagesCount : Math.ceil(totalCount / params.pageSize!),
            items
        }
    }
}

export const commentsService = new CommentsService(generateId)