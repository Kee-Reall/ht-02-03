import {blogViewModel} from "../models/blogModel";
import {postViewModel} from "../models/postsModel";
import {blogs, comments, posts, users} from "../adapters/mongoConnectorCreater";
import {SearchConfiguration} from "../models/searchConfiguration";
import {userLogicModel, userViewModel} from "../models/userModel";
import {commentsDbModel, commentsOutputModel} from "../models/commentsModel";

class QueryRepository {
    private readonly noHiddenId = {projection: {_id: false}};
    private readonly all = {};
    private readonly commentProjection = {projection:{_id: false,postId: false}}
    private readonly userProjection = {projection: {_id: false, hash: false, salt: false}}
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

    async getBlogWithPagination(config: SearchConfiguration<blogViewModel>): Promise<blogViewModel[] | null> {
        const filter = config.filter!.name ? { name: new RegExp(config.filter!.name as string,'i') } : {}
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

    async getPostsWithPagination(config: SearchConfiguration<postViewModel>) {
        const direction: 1 | -1 = config.sortDirection! === 'asc' ? 1 : -1
        try {
            return await posts.find(this.all, this.noHiddenId)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .toArray()
        } catch (e) {
            return null
        }
    }

    async getPostsByFilter(config: SearchConfiguration<postViewModel>): Promise<postViewModel[] | null> {
        try {
            const sorter: any = {[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1}
            return await posts.find(config.filter!,this.noHiddenId)
                .sort(sorter)
                .skip(config.shouldSkip)
                .limit(config.limit)
                .toArray()
        } catch (e) {
            return null
        }
    }

    async getUsersCount(config: any): Promise<number> {
        try {
            return users.count(config)
        } catch (e) {
            return 0
        }
    }

    async getUsers(config: any): Promise<userViewModel[] | null> {
        try {
            const direction : 1 | -1 = config.sortDirection === 'asc' ? 1 : -1
            return await users.find(config.filter,this.userProjection)
                .sort({[config.sortBy]: direction})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .toArray()
        } catch (e) {
            return null
        }
    }

    async getUserById(id: string): Promise<userViewModel | null> {
        try {
            return await users.findOne({id},this.userProjection)
        } catch (e) {
            return null
        }
    }

    async getUserByLogin(login: string): Promise<userViewModel | null> {
        try {
            return await users.findOne({login},this.userProjection)
        } catch (e) {
            return null
        }
    }

    async getUserByEmail(email: string): Promise<userViewModel | null> {
        try {
            return await users.findOne({email},this.userProjection)
        } catch (e) {
            return null
        }
    }

    async getUserByLoginOrEmail(loginOrEmail: string): Promise<userLogicModel | null> {
        try {
            return await users.findOne({
                $or: [
                    {login: loginOrEmail},
                    {email: loginOrEmail}
                ]
            }, this.noHiddenId)
        } catch (e) {
            return null
        }
    }

    async getCommentById(id: string): Promise<commentsOutputModel | null> {
        try {
            return await comments.findOne({id},this.commentProjection)
        } catch (e) {
            return null
        }
    }

    async countCommentsByPostId(postId: string): Promise<number> {
        try {
            return await comments.count({postId})
        } catch(e) {
            return 0
        }
    }

    async getCommentsByPostId(config: SearchConfiguration<commentsDbModel>): Promise<commentsOutputModel[] | null> {
        try {
            return await comments.find({postId : config.filter!.postId},this.commentProjection)
                .sort({[config.sortBy]: config.sortDirection === 'asc' ? 1 : -1})
                .skip(config.shouldSkip)
                .limit(config.limit)
                .toArray()         
        } catch (e) {
            return null
        }
    }
}

export const queryRepository = new QueryRepository()