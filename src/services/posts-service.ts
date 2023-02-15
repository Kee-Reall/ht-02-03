import {inject, injectable} from "inversify";
import {QueryRepository} from "../repositories/queryRepository";
import {Post, PostInputModel, PostViewModel} from "../models/postsModel";
import { Blog } from "../models/blogModel";
import {CommandRepository} from "../repositories/commandRepository";
import {BlogFilters} from "../models/filtersModel";
import {SearchConfiguration} from "../models/searchConfiguration";
import {CommentsService} from "./comments-service";
import {IdCreatorFunction} from "../models/mixedModels";

@injectable()
export class PostsService {

    constructor(
        @inject(QueryRepository)protected queryRepository: QueryRepository,
        @inject(CommandRepository)protected commandRepository: CommandRepository,
        @inject(CommentsService)protected commentsService: CommentsService,
        @inject<IdCreatorFunction>('idGenerator') protected generateId: IdCreatorFunction
    ) {}

    async getPost(id:string): Promise<Post> {
        return await this.queryRepository.getPost(id)
    }

    async getPostsWithPagination(params: BlogFilters) {
        const searchConfig: SearchConfiguration<PostViewModel> = {
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

    async createPost(postInput: PostInputModel): Promise<Post> {
        const {blogId, content, shortDescription, title} = postInput
        const id = this.generateId("post")
        const blog: Blog = await this.queryRepository.getBlogById(blogId)
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

    async updatePost(id: string, postInput: PostInputModel): Promise<boolean> {
        const {blogId, content, shortDescription, title} = postInput
        const blog = await this.queryRepository.getBlogById(blogId)
        if(!blog) {
            return false
        }
        const {name: blogName} = blog
        const toUpdate: PostInputModel & {blogName?: string} = {blogId,content,shortDescription,title,blogName}
        return this.commandRepository.updatePost(id,toUpdate)
    }

    async deletePost(id:string): Promise<boolean> {
        return await this.commandRepository.deletePost(id)
    }
}