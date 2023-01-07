import {queryRepository} from "../repositories/queryRepository";

export async function checkForExistingBlog (value: string) {
    const result = await queryRepository.getBlogById(value)
    if(!result) {
        throw new Error('blog does not exist')
    } else {
        return true
    }
}