import {QueryRepository} from "../repositories/queryRepository";
import {iocContainer} from "../containers/iocContainer";

export async function checkForExistingPost (value: string) {
    const queryRepository = iocContainer.resolve(QueryRepository)
    const result = await queryRepository.getPost(value)
    if(!result) {
        throw new Error('post does not exist')
    } else {
        return true
    }
}