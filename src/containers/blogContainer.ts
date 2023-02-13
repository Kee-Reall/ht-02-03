import "reflect-metadata"
import {Container} from 'inversify'
import {BlogsController} from "../controllers/blogsController";
import {BlogsService} from "../services/blogs-service";
import {QueryRepository} from "../repositories/queryRepository";
import {Normalizer} from "../helpers/normalizer";
import {CommandRepository} from "../repositories/commandRepository";

export const blogContainer = new Container()
blogContainer.bind(BlogsController).toSelf()
blogContainer.bind(BlogsService).toSelf()
blogContainer.bind(QueryRepository).toSelf()
blogContainer.bind(CommandRepository).toSelf()
blogContainer.bind(Normalizer).toSelf()