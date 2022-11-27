import {blogInputModel, blogViewModel} from "../models/blogModel";
import {postViewModel, postInputModel} from "../models/postsModel";
import {blogs} from "./dbCreate";
import { Collection } from 'mongodb'

class Store {
    constructor() {}

    generateId(string: "blog" | "post") {
        return string + Math.ceil(Math.random() * (10 ** 15)).toString(36)
    }

    async getAllBlogs(): Promise<blogViewModel[]> {
        const found = await blogs.find({}).toArray();
        found.forEach(el=>{
            //@ts-ignore
            delete el._id
        })
        return found
    }


    async getBlog(id:string): Promise<blogViewModel | null> {
        const found = await blogs.findOne( {id: id})
        if(found) {
            // @ts-ignore
            delete found._id
        }
        return found
    }

    async createBlog(blog: blogInputModel): Promise <blogViewModel | undefined> {
        const toPush = {id: this.generateId('blog'),...blog}
        try {
            await blogs.insertOne(toPush)
            return toPush
        }catch (e) {
            return undefined
        }
    }

    async updateBlog(id: string,blog: blogInputModel): Promise<boolean> {
        try {
            await blogs.updateOne({id: id},{$set:{...blog}})
            return true
        } catch (e) {
            return false
        }

    }

    async deleteBlog(id: string): Promise<boolean> {
        let flag: boolean
        await blogs.deleteOne({id: id})
        return flag
    }

    async getAllPosts(): Promise<postViewModel[]> {
        //return this.posts
    }

    async getPost(id:string): Promise<postViewModel | undefined> {
        return this.posts.find( el => el.id === id)
    }

    async createPost(post: postInputModel): Promise<postViewModel> {
        const id = this.generateId("post")
        const blog = await this.getBlog(post.blogId)
        const toPut = {id,...post, blogName: blog!.name}
        this.posts.push(toPut)
        return toPut
    }

    async updatePost(id: string,post: postInputModel): Promise<boolean> {
        let flag = false
        ///refactor this
        return flag
    }

    async deletePost(id: string):Promise<boolean> {
        let flag: boolean = false
        if( await this.getPost(id)) {
            flag = true
            this.posts = this.posts.filter(el=> el.id !== id)
        }
        return flag
    }

    clearStore(): void {

    }
}

const store = new Store()
export { store }