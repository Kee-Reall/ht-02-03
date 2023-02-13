import {inject, injectable} from "inversify";
import {QueryRepository} from "../repositories/queryRepository";
import {post, postInputModel, postViewModel} from "../models/postsModel";
import { blog } from "../models/blogModel";
import generateId from "../helpers/generateId";
import {CommandRepository} from "../repositories/commandRepository";
import {blogFilters} from "../models/filtersModel";
import {SearchConfiguration} from "../models/searchConfiguration";
import {commentCreationModel} from "../models/commentsModel";
import {CommentsService} from "./comments-service";
import { commentsFilter } from "../models/filtersModel"
import {getOutput} from "../models/ResponseModel";


@injectable()
export class PostsService {

    constructor(
        @inject(QueryRepository)protected queryRepository: QueryRepository,
        @inject(CommandRepository)protected commandRepository: CommandRepository,
        @inject(CommentsService)protected commentsService: CommentsService
    ) {}

    async getPost(id:string): Promise<post> {
        return await this.queryRepository.getPost(id)
    }

    async getPostsWithPagination(params: blogFilters) {
        const searchConfig: SearchConfiguration<postViewModel> = {
            sortBy: params.sortBy!,
            sortDirection: params.sortDirection!,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1),
            limit: params.pageSize!
        }
        const totalCount = await this.queryRepository.getPostsCount()
        const pagesCount = Math.ceil(totalCount / params.pageSize!)
        const items = await this.queryRepository.getPostsWithPagination(searchConfig) || []
        return {
            pagesCount,
            page: params.pageNumber!,
            pageSize: params.pageSize!,
            totalCount,
            items
        }

    }

    async createPost(postInput: postInputModel): Promise<post> {
        const {blogId, content, shortDescription, title} = postInput
        const id = generateId("post")
        const blog: blog = await this.queryRepository.getBlogById(blogId)
        if(!blog) return null
        const toPut = {
            id, blogId, content, shortDescription , title,
            blogName: blog.name,
            createdAt: new Date(Date.now()).toISOString()
        }
        const result = await this.commandRepository.createPost(toPut)
        if(!result) {
            return null
        }
        return await this.queryRepository.getPost(id)
    }

    async updatePost(id: string, postInput: postInputModel): Promise<boolean> {
        const {blogId, content, shortDescription, title} = postInput
        const blog = await this.queryRepository.getBlogById(blogId)
        if(!blog) {
            return false
        }
        const {name: blogName} = blog
        const toUpdate: postInputModel & {blogName?: string} = {blogId,content,shortDescription,title,blogName}
        return this.commandRepository.updatePost(id,toUpdate)
    }

    async createComment(input: commentCreationModel) {
        return  await this.commentsService.createComment(input)
    }

    async getCommentForPost(configuration: commentsFilter): Promise<getOutput> {
        return await this.commentsService.getCommentsByPost(configuration)
    }

    async deletePost(id:string): Promise<boolean> {
        return await this.commandRepository.deletePost(id)
    }
}