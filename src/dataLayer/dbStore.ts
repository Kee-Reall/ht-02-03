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
        return await blogs.find({}).toArray();
    }


    async getBlog(id:string): Promise<blogViewModel | undefined> {
        return await blogs.findOne( {id: id})
    }

    async createBlog(blog: blogInputModel): Promise <blogViewModel | undefined> {
        const toPush = {id: this.generateId('blog'),...blog}
        this.blogs.push(toPush)
        return toPush
    }

    async updateBlog(id: string,blog: blogInputModel): Promise<boolean> {
        let flag = false
        this.blogs = this.blogs.map(el =>{
            if (el.id === id) {
                flag = true
                return {
                    id: el.id,
                    ...blog
                }
            }
            return el
        })
        return flag
    }

    async deleteBlog(id: string): Promise<boolean> {
        let flag: boolean = false
        if(await this.getBlog(id)) {
            flag = true
          //  this.blogs = this.blogs.filter(el=> el.id !== id)
        }
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