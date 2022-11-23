import { Router } from "express";
import blogsController from "../controllers/blogsController";
import { body } from "express-validator"
import { message } from "../enums/messageEnum";
import { errorHas } from "../middleware/errorHas";

const blogsRouter = Router()

const root = '/'
const param = root + ':id'

const createMidlewares = [
    body('name').exists().withMessage(message.requireField).isString().trim().withMessage(message.invalidType).isLength({min:1,max:15}).withMessage(message.lengh),
    body('description').exists().withMessage(message.requireField).isString().trim().isLength({min:1,max:500}).withMessage(message.lengh),
    body('websiteUrl').exists().withMessage(message.requireField).isString().trim().isLength({min:1,max:15}).isURL().withMessage(message.notUrl),
    errorHas
]

blogsRouter.get(root  , blogsController.getAll)
blogsRouter.get(param , blogsController.getOne)
blogsRouter.post(root, ...createMidlewares , blogsController.createBlog)
blogsRouter.put(param , blogsController.updateBlogUsingId)
blogsRouter.patch(root , blogsController.deprecated)
blogsRouter.delete(param, blogsController.deleteBlogUsingId)

export { blogsRouter }