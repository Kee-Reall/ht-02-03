import {blogInputModel, blogViewModel} from "../models/blogModel";
import {postViewModel, postInputModel} from "../models/postsModel";
import {blogs, posts} from "./dbCreate";

class Store {
    constructor() {}

    generateId(string: "blog" | "post") {
        return string + Math.ceil(Math.random() * (10 ** 15)).toString(36)
    }

    async getAllBlogs(): Promise<blogViewModel[] | null> {
        try {
            const found = await blogs.find({}).toArray();
            found.forEach(el=>{
                //@ts-ignore
                delete el._id
            })
            return found
        } catch (e) {
            return null
        }
    }


    async getBlog(id:string): Promise<blogViewModel | null> {
        try {
            const found = await blogs.findOne({id})
            if(found) {
                // @ts-ignore
                delete found._id
            }
            return found
        }
        catch(e) {
            return null
        }
    }

    async createBlog(blog: blogInputModel): Promise <blogViewModel | null> {
        const toPush = {id: this.generateId('blog'),...blog}
        try {
            await blogs.insertOne(toPush)
            return toPush
        }catch (e) {
            return null
        }
    }

    async updateBlog(id: string,blog: blogInputModel): Promise<boolean> {
        try {
            await blogs.updateOne({id},{$set:{...blog}})
            return true
        } catch (e) {
            return false
        }

    }

    async deleteBlog(id: string): Promise<boolean> {
        try {
            await blogs.deleteOne({id})
            return true
        } 
        catch (e) {
            return false
        }
    }

    async getAllPosts(): Promise<postViewModel[] | null> {
        try {
            const found = await posts.find({}).toArray();
            found.forEach(el=>{
                //@ts-ignore
                delete el._id
            })
            return found
        } catch (e) {
            return null
        }
    }

    async getPost(id:string): Promise<postViewModel | null> {
        try {
            const found = await posts.findOne({id})
            if(found) {
                // @ts-ignore
                delete found._id
            }
            return found
        }
        catch(e) {
            return null
        }
    }

    async createPost(post: postInputModel): Promise<postViewModel | null> {
        try {
            const id = this.generateId("post")
            const blog = await this.getBlog(post.blogId)
            const toPut = {id,...post, blogName: blog!.name}
            await posts.insertOne(toPut)
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
            posts.updateOne({id},{
                $set: {
                    blogName: blogName!.name,
                    ...post
                }
            })
            return true
        }
        catch (e) {
            return false
        }
    }

    async deletePost(id: string):Promise<boolean> {
        try {
            await blogs.deleteOne({id})
            return true
        } 
        catch (e) {
            return false
        }
    }

    clearStore(): void {

    }
}

const dbStore = new Store()
export { dbStore }