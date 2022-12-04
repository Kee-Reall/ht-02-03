import { queryRepository } from "../repositories/queryRepository";
import {blogInputModel, blog, blogs, blogFilters} from "../models/blogModel";
import generateId from "../helpers/generateId";
import { commandRepository } from "../repositories/commandRepository";

class BlogsService {
    async getAllBlogs(): Promise<blogs> {
        return await queryRepository.getAllBlogs()
    }

    async getBlogs(params: blogFilters) {
        const shouldSkip: number = params.pageSize! * (params.pageNumber! - 1 )
        const total = await queryRepository.getBlogsCount()
        return {
            pagesCount: Math.ceil(total / params.pageSize!)

        }
    }

    async getBlog(id: string): Promise<blog> {
        return await queryRepository.getBlogById(id)
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
