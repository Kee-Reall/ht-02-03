import {blogInputModel, blogViewModel} from "../models/blogModel";
import {postInputModel, postViewModel} from "../models/postsModel";
import {blogs, posts} from "./dbCreate";

class Store {
    constructor() {}

    generateId(string: "blog" | "post"): string {
        return string + Math.ceil(Math.random() * (10 ** 16)).toString(36)
    }

    async getAllBlogs(): Promise<blogViewModel[] | null> {
        try {
            return await blogs.find({}, {projection: {_id: false}}).toArray()
        } catch (e) {
            return null
        }
    }

    async getBlog(id:string): Promise<blogViewModel | null> {
        try {
            return await blogs.findOne({id}, {projection: {_id: false}})
        }
        catch(e) {
            return null
        }
    }

    async createBlog(blog: blogInputModel): Promise <blogViewModel | null> {
        const toPush = {
            id: this.generateId('blog'),
            ...blog,
            createdAt: new Date(Date.now()).toISOString()
        }
        try {
            await blogs.insertOne(toPush)
            return toPush
        }catch (e) {
            return null
        }
    }

    async updateBlog(id: string,blog: blogInputModel): Promise<boolean> {
        try {
            const {modifiedCount} = await blogs.updateOne({id},{$set:{...blog}})
            return modifiedCount > 0
        } catch (e) {
            return false
        }

    }

    async deleteBlog(id: string): Promise<boolean> {
        try {
            const {deletedCount} =  await blogs.deleteOne({id})
            return deletedCount > 0
        } 
        catch (e) {
            return false
        }
    }

    async getAllPosts(): Promise<postViewModel[] | null> {
        try {
            return await posts.find({}, {projection: {_id: false}}).toArray()
        } catch (e) {
            return null
        }
    }

    async getPost(id:string): Promise<postViewModel | null> {
        try {
            return await posts.findOne({id}, {projection: {_id: false}})
        }
        catch(e) {
            return null
        }
    }

    async createPost(post: postInputModel): Promise<postViewModel | null> {
        try {
            const id = this.generateId("post")
            const blog = await this.getBlog(post.blogId)
            const toPut = {
                id,
                ...post,
                blogName: blog!.name,
                createdAt: new Date(Date.now()).toISOString()
            }
            await posts.insertOne(toPut,{})
            //@ts-ignore
            delete toPut._id
            return toPut
        }
        catch(e) {
            return null
        }
        
    }

    async updatePost(id: string,post: postInputModel): Promise<boolean> {
        try {
            const blogName = await this.getBlog(post.blogId)
            if(!blogName?.name) {
                return false
            }
            const {modifiedCount} = await posts.updateOne({id},{
                $set: {
                    blogName: blogName!.name,
                    ...post
                }
            })
            return modifiedCount > 0
        }
        catch (e) {
            return false
        }
    }

    async deletePost(id: string):Promise<boolean> {
        try {
            const {deletedCount} =  await blogs.deleteOne({id})
            return deletedCount > 0
        } 
        catch (e) {
            return false
        }
    }

    async clearStore(): Promise<void> {
        await posts.deleteMany({})
        await blogs.deleteMany({})
    }
}

const dbStore = new Store()
export { dbStore }