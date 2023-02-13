import {Container} from "inversify";
import {CommentsController} from "../controllers/commentsController";
import {CommentsService} from "../services/comments-service";
import {QueryRepository} from "../repositories/queryRepository";
import {CommandRepository} from "../repositories/commandRepository";

export const commentContainer = new Container()
commentContainer.bind(CommentsController).to(CommentsController)
commentContainer.bind(CommentsService).to(CommentsService)
commentContainer.bind(QueryRepository).to(QueryRepository)
commentContainer.bind(CommandRepository).to(CommandRepository)