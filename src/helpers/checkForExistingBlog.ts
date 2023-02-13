import {blogContainer} from "../containers/blogContainer";
import {QueryRepository} from "../repositories/queryRepository";

export async function checkForExistingBlog (value: string) {
    const queryRepository = blogContainer.resolve(QueryRepository)
    const result = await queryRepository.getBlogById(value)
    if(!result) {
        throw new Error('blog does not exist')
    } else {
        return true
    }
}