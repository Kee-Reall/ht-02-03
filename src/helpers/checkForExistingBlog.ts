import {queryRepository} from "../repositories/queryRepository";
import {post} from "../models/postsModel";
import {postsService} from "../services/posts-service";

export async function checkForExistingBlog (value: string) {
    const result = await queryRepository.getBlogById(value)
    if(!result) {
        throw new Error('blogId does not exist')
    }
    else {
        return true
    }
}

export async function checkForExistingBlogB (value: string): Promise<boolean> {
    const result: post = await postsService.getPost(value)
    if(result) {
        return true
    } return false
}