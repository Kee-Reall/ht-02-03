import {iocContainer} from "../containers/iocContainer";
import {QueryRepository} from "../repositories/queryRepository";

export async function checkForExistingBlog (value: string) {
    const queryRepository = iocContainer.resolve(QueryRepository)
    const result = await queryRepository.getBlogById(value)
    if(!result) {
        throw new Error('blog does not exist')
    } else {
        return true
    }
}