import {blogInputModel, blogViewModel} from "../models/blogModel";
import {postInputModel, postViewModel} from "../models/postsModel";
import {blogs, posts, users} from "./connectorCreater";
import {userLogicModel} from "../models/userModel";

class CommandRepository {

    private readonly emptyObject = {}

    async createBlog(blog: blogViewModel): Promise<boolean> {
        try {
            const insert = await blogs.insertOne(blog)
            return insert.acknowledged
        } catch (e) {
            return false
        }
    }

    async updateBlog(id: string, updatedFields: blogInputModel): Promise<boolean> {
        try {
            const {modifiedCount} = await blogs.updateOne({id}, {$set: updatedFields})
            return modifiedCount > 0
        } catch (e) {
            return false
        }
    }

    async deleteBlog(id: string): Promise<boolean> {
        try {
            const {deletedCount} = await blogs.deleteOne({id})
            return deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createPost(post: postViewModel): Promise<boolean> {
        try {
            const result = await posts.insertOne(post)
            return result.acknowledged
        } catch (e) {
            return false
        }
    }

    async updatePost(id: string, updateFields: postInputModel): Promise<boolean> {
        try {
            const {modifiedCount} = await posts.updateOne({id}, {$set: updateFields})
            return modifiedCount > 0
        } catch (e) {
            return false
        }
    }

    async deletePost(id: string): Promise<boolean> {
        try {
            const {deletedCount} = await posts.deleteOne({id})
            return deletedCount > 0
        } catch (e) {
            return false
        }
    }

    async createUser(user: userLogicModel): Promise<boolean> {
        try {
            const {acknowledged} = await users.insertOne(user)
            return acknowledged
        } catch (e) {
            return false
        }
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await users.deleteOne({id})
            return result.deletedCount !== 0
        } catch (e) {
            return false
        }
    }

    async clearStore(): Promise<void> {
        await Promise.all([
            posts.deleteMany(this.emptyObject),
            blogs.deleteMany(this.emptyObject),
            users.deleteMany(this.emptyObject)
        ])
    }
}

const commandRepository = new CommandRepository()
export {commandRepository}