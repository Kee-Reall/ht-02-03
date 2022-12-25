import {userForCommentsModel, userViewModel} from "../models/userModel";
import {CommentsInputModel, CommentsViewModel} from "../models/commentsModel";
import {queryRepository} from "../repositories/queryRepository";
import {commentUpdateResult} from "../models/mixedModels";
import {commandRepository} from "../repositories/commandRepository";
import {comments} from "../repositories/connectorCreater";

class CommentsService {

    async createComment (postId: string,input: CommentsInputModel,owner:userForCommentsModel) {

    }

    async getCommentById(id: string): Promise<CommentsViewModel | null> {
        return await queryRepository.getCommentById(id)
    }
    async updateCommentAfterMiddleware(comment: CommentsViewModel,content: string): Promise<boolean> {
        return  await commandRepository.updateComment(comment.id,content)
    }

    async deleteCommentAfterMiddleware(id: string) {
        return await commandRepository.deleteComment(id)
    }

    async getCommentsByPost(postId: string) {

    }
}

export const commentsService = new CommentsService()