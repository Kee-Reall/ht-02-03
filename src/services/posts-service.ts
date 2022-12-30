import { queryRepository } from "../repositories/queryRepository";
import {post, posts, postInputModel, postViewModel} from "../models/postsModel";
import { blog } from "../models/blogModel";
import generateId from "../helpers/generateId";
import { commandRepository } from "../repositories/commandRepository";
import {blogFilters} from "../models/filtersModel";
import {SearchConfiguration} from "../models/searchConfiguration";
import {CommentCreationModel} from "../models/commentsModel";
import {commentsService} from "./comments-service";
import { commentsFilter } from "../models/filtersModel"


class PostsService {
    async getAllPosts(): Promise<posts> {
        return await queryRepository.getAllPosts()
    }

    async getPost(id:string): Promise<post> {
        return await queryRepository.getPost(id)
    }

    async getPostsWithPagination(params: blogFilters) {
        const searchConfig: SearchConfiguration<postViewModel> = {
            sortBy: params.sortBy!,
            sortDirection: params.sortDirection!,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1),
            limit: params.pageSize!
        }
        const totalCount = await queryRepository.getPostsCount()
        const pagesCount = Math.ceil(totalCount / params.pageSize!)
        const items = await queryRepository.getPostsWithPagination(searchConfig) || []
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
        const blog: blog = await queryRepository.getBlogById(blogId)
        const toPut = {
            id, blogId, content, shortDescription , title,
            blogName: blog!.name,
            createdAt: new Date(Date.now()).toISOString()
        }
        const result = await commandRepository.createPost(toPut)
        if(result) {
            return await queryRepository.getPost(id)
        }
        return null
    }

    async updatePost(id: string, postInput: postInputModel): Promise<boolean> {
        const {blogId, content, shortDescription, title} = postInput
        const blog = await queryRepository.getBlogById(blogId)
        if(blog === null) {
            return false
        }
        const {name: blogName} = blog
        const toUpdate = {blogId,content,shortDescription,title,blogName}
        return commandRepository.updatePost(id,toUpdate)
    }

    async createComment(input: CommentCreationModel) {
        return await commentsService.createComment(input)
    }

    async getCommentForPost(configuration: commentsFilter) {
        return await commentsService.getCommentsByPost(configuration)
    }

    async deletePost(id:string): Promise<boolean> {
        return await commandRepository.deletePost(id)
    }
}

const postsService = new PostsService()
export { postsService }