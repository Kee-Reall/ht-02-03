import {blogViewModel} from "../models/blogModel";
import {postViewModel} from "../models/postsModel";
import {blogs, posts} from "./connectorCreater";
import {SearchConfiguration} from "../models/searchConfiguration";

class QueryRepository {
    private readonly noHiddenId = {projection: {_id: false}};
    private readonly all = {};

    async getAllBlogs(filter: {} | any = this.all): Promise<blogViewModel[] | null> {
        try {
            const reg = {name: {$regex: filter.searchNameTerm,$options: "i"}}
            return await blogs.find(reg, this.noHiddenId).toArray()
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

    async getPostsCount(filter: any = this.all): Promise<number> {
        try {
            return await posts.count(filter)
        } catch (e) {
            return 0
        }
    }

    async getBlogWithPagination(config: SearchConfiguration): Promise<blogViewModel[] | null> {
        const filter = {
            name: {
                $regex: config.filter!.name,
                $options: "i"
            }
        }
        const direction: 1 | -1 = config.sortDirection! === 'asc' ? 1 : -1
        try {
            return await blogs.find(filter, this.noHiddenId)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
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

    async getPostsWithPagination(config: SearchConfiguration) {
        const direction: 1 | -1 = config.sortDirection! === 'asc' ? 1 : -1
        try {
            return await blogs.find(this.all, this.noHiddenId)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .toArray()
        } catch (e) {
            return null
        }
    }

    async getPostsByFilter(config: SearchConfiguration): Promise<postViewModel[] | null> {
        try {
            const sorter: any = {[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1}
            return await posts.find(config.filter!)
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