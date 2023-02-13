import {blogInputModel, blog, blogViewModel} from "../models/blogModel";
import generateId from "../helpers/generateId";
import {CommandRepository} from "../repositories/commandRepository";
import {blogFilters} from "../models/filtersModel";
import {getOutput} from "../models/ResponseModel";
import {SearchConfiguration} from "../models/searchConfiguration";
import {postInputThrowBlog, postInputModel, postViewModel} from "../models/postsModel";
import { postsService } from "./posts-service";
import {QueryRepository} from "../repositories/queryRepository";
import {injectable,inject} from "inversify";

@injectable()
export class BlogsService {
    constructor(
        @inject(QueryRepository)protected queryRepository: QueryRepository,
        @inject(CommandRepository)protected commandRepository: CommandRepository
    ) {}

        async getBlogs(params: blogFilters): Promise<getOutput> {
        const searchConfig:SearchConfiguration<blogViewModel> = {
            filter: {
                name: params.searchNameTerm!
            },
            sortBy : params.sortBy!,
            sortDirection: params.sortDirection!,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1 ),
            limit: params.pageSize!
        }
        const totalCount = await  this.queryRepository.getBlogsCount(searchConfig.filter!.name as string)
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

    async getBlog(id: string): Promise<blog> {
        return await this.queryRepository.getBlogById(id)
    }

    async getBlogPosts(blogId: string, params: any) {
        const config:SearchConfiguration<postViewModel> = {
            filter: {blogId},
            sortBy: params.sortBy,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1 ),
            limit: params.pageSize,
            sortDirection: params.sortDirection
        }
        const blogGot = await this.queryRepository.getPostsByFilter(config)
        const totalCount = await this.queryRepository.getPostsCount(config.filter)
        return {
            pagesCount: Math.ceil(totalCount / params.pageSize!),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount,
            items: blogGot
        }
    }

    async createPostForBlog(id:string,inputData: postInputThrowBlog) {
        const post: postInputModel = {
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: id,
        }
        return postsService.createPost(post)
    }

    async createBlog(blogInput: blogInputModel): Promise<blog> {
        const {description, websiteUrl, name} = blogInput
        const id = generateId('blog')
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

    async updateBlog(id: string, blogInput: blogInputModel): Promise<boolean> {
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