import "reflect-metadata"
import {Container} from 'inversify'
import {BlogsController} from "../controllers/blogsController";
import {BlogsService} from "../services/blogs-service";
import {QueryRepository} from "../repositories/queryRepository";
import {Normalizer} from "../helpers/normalizer";
import {CommandRepository} from "../repositories/commandRepository";
import {PostsService} from "../services/posts-service";
import {CommentsService} from "../services/comments-service";

export const blogContainer = new Container()
blogContainer.bind(BlogsController).to(BlogsController)
blogContainer.bind(BlogsService).to(BlogsService)
blogContainer.bind(PostsService).to(PostsService)
blogContainer.bind(CommentsService).to(CommentsService)
blogContainer.bind(QueryRepository).to(QueryRepository)
blogContainer.bind(CommandRepository).to(CommandRepository)
blogContainer.bind(Normalizer).to(Normalizer)