import { queryRepository } from "../repositories/queryRepository";
import {blogInputModel, blog, blogs} from "../models/blogModel";
import generateId from "../helpers/generateId";
import { commandRepository } from "../repositories/commandRepository";
import {blogSearchModel} from "../models/searchModel";
import {blogFilters} from "../models/filtersModel";

class BlogsService {
    async getAllBlogs(): Promise<blogs> {
        return await queryRepository.getAllBlogs()
    }

    async getBlogs(params: blogFilters) {
        const shouldSkip: number = params.pageSize! * (params.pageNumber! - 1 )
        const searchConfig: blogSearchModel = {
            searchNameTerm : params.searchNameTerm!,
            sortBy : params.sortBy!,
            sortDirection: params.sortDirection! === "asc" ? 1 : -1
        }
        const totalCount = await queryRepository.getBlogsCount(searchConfig.searchNameTerm)
        const blogGot = await queryRepository.getBlogWithPagination(shouldSkip,params.pageSize!,searchConfig)
        return {
            pagesCount: Math.ceil(totalCount / params.pageSize!),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount,
            items: blogGot
        }
    }

    async getBlog(id: string): Promise<blog> {
        return await queryRepository.getBlogById(id)
    }

    async getBlogPosts(blogId: string, params: any) {
        const config = {
            filter: {
                blogId
            },
            sortBy: params.sortBy,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1 ),
            limit: params.pageSize,
            sortDirection: params.sortDirection
        }
        const blogGot = await queryRepository.getPostsByFilter(config)
        const totalCount = await queryRepository.getPostsCount(config.filter)
        return {
            pagesCount: Math.ceil(totalCount / params.pageSize!),
            page: params.pageNumber,
            pageSize: params.pageSize,
            totalCount,
            items: blogGot
        }
    }

    async createBlog(blogInput: blogInputModel): Promise<blog> {
        const {description, websiteUrl, name} = blogInput
        const id = generateId('blog')
        const blogToPush = {
            id, description, websiteUrl, name,
            createdAt: new Date(Date.now()).toISOString()
        }
        const result = await commandRepository.createBlog(blogToPush)
        if (result) {
            return queryRepository.getBlogById(id)
        }
        return null
    }

    async updateBlog(id: string, blogInput: blogInputModel): Promise<boolean> {
        const {description, websiteUrl, name} = blogInput
        const updatesField = {description,websiteUrl,name}
        return await commandRepository.updateBlog(id, updatesField)
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await commandRepository.deleteBlog(id)
    }
}

export const blogsService = new BlogsService()
