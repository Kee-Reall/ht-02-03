import {param} from "express-validator";
import {checkForExistingBlog} from "../helpers/checkForExistingBlog";
import {idErrorHas} from "../helpers/idErrorHas";

export const getPostsByBlogMiddleware = [
    param('id').custom(checkForExistingBlog),
    idErrorHas
]