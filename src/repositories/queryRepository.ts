import {blogViewModel} from "../models/blogModel";
import {postViewModel} from "../models/postsModel";
import {blogs, posts} from "./connectorCreater";
import {blogSearchModel} from "../models/searchModel";

class QueryRepository {
    private readonly noHiddenId = {projection: {_id: false}};
    private readonly all = {};

    async getAllBlogs(filter:any = this.all): Promise<blogViewModel[] | null> {
        try {
            const filt = {name: {$regex: filter.searchNameTerm,$options: "i"}}
            return await blogs.find(filt, this.noHiddenId).toArray()
        } catch (e) {
            return null
        }
    }

    async getAllBlogsCount(filter:any): Promise<number> {
        try {
            return await blogs.count(filter)
        } catch (e) {
            return 0
        }
    }

    async getBlogsCount(filter: string): Promise<number> {
        try {
            return  await blogs.count({
                name: new RegExp(filter,'ig')
            })
        } catch (e) {
            return -1
        }
    }

    async getPostsCount(filter: any): Promise<number> {
        try {
            console.log(filter)
            const res = await posts.count(filter)
            return res
        } catch (e) {
            return 0
        }
    }

    async getBlogWithPagination(
        skip: number, limit: number,
        {searchNameTerm, sortBy, sortDirection}: blogSearchModel
    ): Promise<blogViewModel[] | null> {
        const filter = {
            name: {
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
        } catch (e) {
            return null
        }
    }

    async getBlogById(id: string): Promise<blogViewModel | null> {
        try {
            return await blogs.findOne({id}, this.noHiddenId)
        } catch (e) {
            return null
        }
    }

    async getAllPosts(): Promise<postViewModel[] | null> {
        try {
            return await posts.find(this.all, this.noHiddenId).toArray()
        } catch (e) {
            return null
        }
    }

    async getPost(id: string): Promise<postViewModel | null> {
        try {
            return await posts.findOne({id}, this.noHiddenId)
        } catch (e) {
            return null
        }
    }

    async getPostsByFilter(config: any): Promise<postViewModel[] | null> {
        try {
            const sorter: any = {[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1}
            return await posts.find(config.filter)
                .sort(sorter)
                .skip(config.shouldSkip)
                .limit(config.limit)
                .toArray()
        } catch (e) {
            return null
        }
    }
}

export const queryRepository = new QueryRepository()