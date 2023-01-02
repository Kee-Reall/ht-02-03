import {queryRepository} from "../repositories/queryRepository";

export async function checkForExistingBlog (value: string) {
    const result = await queryRepository.getPost(value)
    if(!result) {
        throw new Error('blogId does not exist')
    } else {
        return true
    }
}