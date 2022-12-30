import {CommentsViewModel, CommentCreationModel, CommentsDbModel} from "../models/commentsModel";
import {queryRepository} from "../repositories/queryRepository";
import {commandRepository} from "../repositories/commandRepository";
import generateId from "../helpers/generateId";
import {SearchConfiguration} from "../models/searchConfiguration";
import { eternityId, sortingDirection } from "../models/mixedModels";
import { commentsFilter } from "../models/filtersModel";

class CommentsService {

    constructor(
        public generateId: (arg: eternityId) => string
        ) {}

    async createComment (input: CommentCreationModel): Promise<boolean> {
        const createdAt = new Date(Date.now()).toISOString()
        const { content, user: { id: userId, login: userLogin }, postId} = input
        const id = this.generateId("comment")
        const comment: CommentsViewModel = {createdAt, content, userId , userLogin}
        const toPut: CommentsDbModel = {id,postId, ...comment}
        return await commandRepository.createComment(toPut)
    }

    async getCommentById(id: string): Promise<CommentsViewModel | null> {
        return await queryRepository.getCommentById(id)
    }
    async updateCommentAfterMiddleware(comment: CommentsDbModel,content: string): Promise<boolean> {
        return  await commandRepository.updateComment(comment.id,content)
    }

    async deleteCommentAfterMiddleware(id: string) {
        return await commandRepository.deleteComment(id)
    }

    async getCommentsByPost(params: commentsFilter) {
        const searchConfig: SearchConfiguration<CommentsDbModel> = {
            filter: {
                postId: params.searchId
            },
            sortDirection: params.sortDirection as sortingDirection,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1),
            sortBy: params.sortBy as string,
            limit: params.pageSize as number
        } 
       return await queryRepository.getCommentsByPostId(searchConfig)
    }
}

export const commentsService = new CommentsService(generateId)