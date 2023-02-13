import {QueryRepository} from "../repositories/queryRepository";
import {postContainer} from "../containers/postContainer";

export async function checkForExistingPost (value: string) {
    const queryRepository = postContainer.resolve(QueryRepository)
    const result = await queryRepository.getPost(value)
    if(!result) {
        throw new Error('post does not exist')
    } else {
        return true
    }
}