import {blogViewModel} from "../models/blogModel";
import {postViewModel} from "../models/postsModel";
import {blogs, posts} from "./connectorCreater";
import {blogSearchModel} from "../models/searchModel";

class QueryRepository {
    private readonly noHiddenId = {projection: {_id: false}};
    private readonly all = {};

    async getAllBlogs(): Promise<blogViewModel[] | null> {
        try {
            return await blogs.find(this.all, this.noHiddenId).toArray()
        }
        catch (e) {
            return null
        }
    }

    async getAllBlogsCount(): Promise<number> {
        try {
            return await blogs.countDocuments()
        }
        catch (e) {
            return 0
        }
    }

    async getBlogsCount(filter: any): Promise<number> {
        try {
            const res = await blogs.estimatedDocumentCount()
            console.log(res)
            return res
        }
        catch (e) {
            return 0
        }
    }

    async getBlogWithPagination(
        skip: number, limit: number,
        {searchNameTerm, sortBy, sortDirection}: blogSearchModel
    ): Promise<blogViewModel[] | null> {
        const filter = {
            name:{
                $regex: searchNameTerm,
                $options: "i"
            }
        }
        try {
            return await blogs.find(filter, this.noHiddenId)
                .sort({[sortBy]: sortDirection})
                .skip(skip)
                .limit(limit)
                .toArray()
        }
        catch (e) {
            return null
        }
    }

    async getBlogById(id: string): Promise<blogViewModel | null> {
        try {
            return await blogs.findOne({id}, this.noHiddenId)
        }
        catch (e) {
            return null
        }
    }

    async getAllPosts(): Promise<postViewModel[] | null> {
        try {
            return await posts.find(this.all, this.noHiddenId).toArray()
        }
        catch (e) {
            return null
        }
    }

    async getPost(id: string): Promise<postViewModel | null> {
        try {
            return await posts.findOne({id}, this.noHiddenId)
        }
        catch (e) {
            return null
        }
    }
}

export const queryRepository = new QueryRepository()