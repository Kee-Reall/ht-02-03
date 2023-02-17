import {inject, injectable} from "inversify";
import {QueryRepository} from "../repositories/queryRepository";
import {PostInputModel, PostViewModel} from "../models/postsModel";
import { Blog } from "../models/blogModel";
import {CommandRepository} from "../repositories/commandRepository";
import {BlogFilters} from "../models/filtersModel";
import {SearchConfiguration} from "../models/searchConfiguration";
import {CommentsService} from "./comments-service";
import {IdCreatorFunction, NullablePromise} from "../models/mixedModels";
import {LikeDTO, LikeModel, WithExtendedLike} from "../models/LikeModel";
import {SearchError} from "../helpers/extendedErrors";
import {message} from "../enums/messageEnum";
@injectable()
export class PostsService {

    constructor(
        @inject(QueryRepository)protected queryRepository: QueryRepository,
        @inject(CommandRepository)protected commandRepository: CommandRepository,
        @inject(CommentsService)protected commentsService: CommentsService,
        @inject<IdCreatorFunction>('idGenerator') protected generateId: IdCreatorFunction
    ) {}

    async getPostById(postId:string,userId: string | null = null): NullablePromise<WithExtendedLike<PostViewModel>> {
        const post = await this.queryRepository.getPost(postId)
        if (!post) return null
        const extendedLikesInfo = await this.queryRepository.getExtendedLikeInfo(postId,userId)
        return {...post, extendedLikesInfo}
    }

    async getPostsWithPagination(params: BlogFilters,userId: string | null) {
        const searchConfig: SearchConfiguration<PostViewModel> = {
            sortBy: params.sortBy!,
            sortDirection: params.sortDirection!,
            shouldSkip: params.pageSize! * (params.pageNumber! - 1),
            limit: params.pageSize!
        }
        const totalCount = await this.queryRepository.getPostsCount()
        const pagesCount = Math.ceil(totalCount / params.pageSize!)
        const items = await this.queryRepository.getPostsWithPagination(searchConfig,userId) || []
        return {
            pagesCount,
            page: params.pageNumber!,
            pageSize: params.pageSize!,
            totalCount,
            items
        }

    }

    async createPost(postInput: PostInputModel): NullablePromise<PostViewModel> {
        const {blogId, content, shortDescription, title} = postInput
        const id = this.generateId("post")
        const blog: Blog = await this.queryRepository.getBlogById(blogId)
        if(!blog) return null
        const toPut = {
            id, blogId, content, shortDescription , title,
            blogName: blog.name,
            createdAt: new Date(Date.now()).toISOString()
        }
        const result = await this.commandRepository.createPost(toPut)
        if(!result) {
            return null
        }
        return await this.queryRepository.getPost(id)
    }

    async updatePost(id: string, postInput: PostInputModel): Promise<boolean> {
        const {blogId, content, shortDescription, title} = postInput
        const blog = await this.queryRepository.getBlogById(blogId)
        if(!blog) {
            return false
        }
        const {name: blogName} = blog
        const toUpdate: PostInputModel & {blogName?: string} = {blogId,content,shortDescription,title,blogName}
        return this.commandRepository.updatePost(id,toUpdate)
    }

    private async createLikeEntity(target: string, {likeStatus, userId}: LikeDTO): Promise<LikeModel> {
        const user = await this.queryRepository.getUserById(userId)
        return {
            login: user!.login, likeStatus, userId, target,
            addedAt: new Date(),
            id: this.generateId('like'),
        }

    }

    public async likePost(postId: string, dto: LikeDTO): Promise<boolean> {
        const post = await this.queryRepository.getPost(postId)
        if (!post) {
            throw new SearchError('post', message.notExist)
        }
        const like = await this.queryRepository.getLikeByUserToTarget(dto.userId, postId)
        if (!like) {
            return  await this.commandRepository.createLike(await this.createLikeEntity(postId, dto))
        }
        if (dto.likeStatus === like.likeStatus) {
            return true
        }
        return await this.commandRepository.updateLike(postId,dto.userId,dto.likeStatus)
    }

    async deletePost(id:string): Promise<boolean> {
        return await this.commandRepository.deletePost(id)
    }
}