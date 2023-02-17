import {BlogInputModel, Blog, BlogViewModel} from "../models/blogModel";
import {CommandRepository} from "../repositories/commandRepository";
import {BlogFilters} from "../models/filtersModel";
import {GetOutput} from "../models/ResponseModel";
import {SearchConfiguration} from "../models/searchConfiguration";
import {PostInputThroughBlog, PostInputModel, PostViewModel} from "../models/postsModel";
import {PostsService} from "./posts-service";
import {QueryRepository} from "../repositories/queryRepository";
import {injectable,inject} from "inversify";
import {Entire, IdCreatorFunction, Nullable} from "../models/mixedModels";

@injectable()
export class BlogsService {
    constructor(
        @inject(QueryRepository)protected queryRepository: QueryRepository,
        @inject(CommandRepository)protected commandRepository: CommandRepository,
        @inject(PostsService)protected postsService: PostsService,
        @inject<IdCreatorFunction>('idGenerator') protected generateId: IdCreatorFunction
    ) {}

        async getBlogs(params: BlogFilters): Promise<GetOutput> {
        const searchConfig:SearchConfiguration<BlogViewModel> = {
            filter: {
                name: params.searchNameTerm!
            },
            sortBy : params.sortBy!,
            sortDirection: params.sortDirection!,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1 ),
            limit: params.pageSize!
        }
        const totalCount = await this.queryRepository.getBlogsCount(searchConfig.filter!.name as string)
        const pagesCount = Math.ceil(totalCount / params.pageSize!)
        const items = await this.queryRepository.getBlogWithPagination(searchConfig) || []
        return {
            pagesCount,
            page: params.pageNumber!,
            pageSize: params.pageSize!,
            totalCount,
            items
        }
    }

    async getBlog(id: string): Promise<Blog> {
        return await this.queryRepository.getBlogById(id)
    }

    async getBlogPosts(blogId: string, params: Entire<BlogFilters>, userId: Nullable<string> = null) {
        const config:SearchConfiguration<PostViewModel> = {
            filter: {blogId},
            sortBy: params.sortBy,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1 ),
            limit: params.pageSize,
            sortDirection: params.sortDirection
        }
        const blogGot = await this.queryRepository.getPostsByFilter(config, userId)
        const totalCount = await this.queryRepository.getPostsCount(config.filter)
        return {
            pagesCount: Math.ceil(totalCount / params.pageSize!),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount,
            items: blogGot
        }
    }

    async createPostForBlog(id:string,inputData: PostInputThroughBlog) {
        const post: PostInputModel = {
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: id,
        }
        return this.postsService.createPost(post)
    }

    async createBlog(blogInput: BlogInputModel): Promise<Blog> {
        const {description, websiteUrl, name} = blogInput
        const id = this.generateId('blog')
        const blogToPush = {
            id, description, websiteUrl, name,
            createdAt: new Date(Date.now()).toISOString()
        }
        const result = await this.commandRepository.createBlog(blogToPush)
        if (result) {
            return this.queryRepository.getBlogById(id)
        }
        return null
    }

    async updateBlog(id: string, blogInput: BlogInputModel): Promise<boolean> {
        const {description, websiteUrl, name} = blogInput
        const updatesField = {description,websiteUrl,name}
        const result = await this.commandRepository.updateBlog(id, updatesField)
        if(result) {
            await this.commandRepository.updateManyPostsByBlogId(id)
        }
        return result
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await this.commandRepository.deleteBlog(id)
    }
}