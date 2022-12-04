import { blogViewModel } from "../models/blogModel";
import { postViewModel } from "../models/postsModel";
import { blogs, posts } from "./connectorCreater";

class QueryRepository {
    private readonly noHiddenId = {projection: {_id:false}};
    private readonly all = {};

    async getAllBlogs(): Promise<blogViewModel[] | null> {
        try {
            return await blogs.find(this.all, this.noHiddenId).toArray()
        }
        catch (e) {
            return null
        }
    }

    async getBlogById(id:string): Promise<blogViewModel | null> {
        try {
            return await blogs.findOne({id}, this.noHiddenId)
        }
        catch(e) {
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

    async getPost(id:string): Promise<postViewModel | null> {
        try {
            return await posts.findOne({id}, this.noHiddenId)
        }
        catch(e) {
            return null
        }
    }
}

export const queryRepository = new QueryRepository()