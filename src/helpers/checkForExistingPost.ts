import {queryRepository} from "../repositories/queryRepository";

export async function checkForExistingPost (value: string) {
    const result = await queryRepository.getPost(value)
    if(!result) {
        throw new Error('blogId does not exist')
    } else {
        return true
    }
}