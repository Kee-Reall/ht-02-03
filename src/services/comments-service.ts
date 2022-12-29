import {CommentsViewModel, CommentCreationModel, CommentsDbModel} from "../models/commentsModel";
import {queryRepository} from "../repositories/queryRepository";
import {commandRepository} from "../repositories/commandRepository";
import generateId from "../helpers/generateId";
import {SearchConfiguration} from "../models/searchConfiguration";
import { eternityId } from "../models/mixedModels";

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

    async getCommentsByPost(postId: string, config: SearchConfiguration<CommentsDbModel>) {
        queryRepository.getCommentsByPostId(postId,config)
    }
}

export const commentsService = new CommentsService(generateId)