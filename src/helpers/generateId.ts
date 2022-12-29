import { eternityId } from "../models/mixedModels"
export default (string: eternityId): string => {
    return string
        + Math.ceil(Math.random() * (10 ** 16)).toString(36)
        + Math.ceil(Math.random() * (10 ** 16)).toString(36)
}