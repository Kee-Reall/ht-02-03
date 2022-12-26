import {CommentsDbModel, CommentsOutputModel, CommentsViewModel} from "../models/commentsModel";

export function commentProjection(commentDb: CommentsDbModel | null): CommentsOutputModel | null {
    if (commentDb === null) {
        return null
    } else {
        const {comment, id} = commentDb
        return {
            id, ...comment
        }
    }
}

