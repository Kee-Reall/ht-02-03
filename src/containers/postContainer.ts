import {Container} from "inversify";
import {PostsController} from "../controllers/postsController";
import {PostsService} from "../services/posts-service";
import {Normalizer} from "../helpers/normalizer";
import {CommentsService} from "../services/comments-service";
import {QueryRepository} from "../repositories/queryRepository";
import {CommandRepository} from "../repositories/commandRepository";

export const postContainer = new Container()
postContainer.bind(PostsController).to(PostsController)
postContainer.bind(PostsService).to(PostsService)
postContainer.bind(Normalizer).to(Normalizer)
postContainer.bind(CommentsService).to(CommentsService)
postContainer.bind(QueryRepository).to(QueryRepository)
postContainer.bind(CommandRepository).to(CommandRepository)