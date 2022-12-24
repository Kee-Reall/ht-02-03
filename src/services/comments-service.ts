import {userForCommentsModel, userViewModel} from "../models/userModel";
import {CommentsInputModel, CommentsViewModel} from "../models/commentsModel";
import {queryRepository} from "../repositories/queryRepository";
import {commentUpdateResult} from "../models/mixedModels";

class CommentsService {

    async createComment (postId: string,input: CommentsInputModel,owner:userForCommentsModel) {

    }

    async getCommentById(id: string): Promise<CommentsViewModel | null> {
        return await queryRepository.getCommentById(id)
    }
    async updateComment(id: string,input: CommentsInputModel,initiator: userViewModel): Promise<commentUpdateResult> {
        const comment = await this.getCommentById(id)
        if(comment === null) {
            return 'not exist'
        }
        if(comment.userId !== initiator.id) {
            return 'initiator not owner'
        }
    }

    async deleteComment(id: string) {

    }

    async getCommentsByPost(postId: string) {

    }
}

export const commentsService = new CommentsService()