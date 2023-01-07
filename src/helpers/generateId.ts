import { eternityId } from "../models/mixedModels"
import randomString from "./generateRandomString";
export default (string: eternityId): string => {
    return string[0] + string.at(-1) + randomString()
}