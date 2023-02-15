import "reflect-metadata"
import {Container} from "inversify";
import {UsersController} from "../controllers/usersController";
import {UsersService} from "../services/users-service";
import {QueryRepository} from "../repositories/queryRepository";
import {CommandRepository} from "../repositories/commandRepository";
import {MailWorker} from "../repositories/mailWorker";
import {JwtService} from "../services/jwt-service";
import {AuthService} from "../services/auth-Service";
import {AuthController} from "../controllers/authController";
import {SecurityService} from "../services/security-service";
import {SecurityController} from "../controllers/securityController";
import {Normalizer} from "../helpers/normalizer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {mailAdapter} from "../adapters/mailAdapter";
import {Attempts, Blogs, Comments, Likes, Posts, Sessions, Users} from "../adapters/mongooseCreater";
import {Model} from "mongoose";
import {TestingController} from "../controllers/testingController";
import {PostsController} from "../controllers/postsController";
import {PostsService} from "../services/posts-service";
import {CommentsService} from "../services/comments-service";
import {BlogsController} from "../controllers/blogsController";
import {BlogsService} from "../services/blogs-service";
import {generateDeviceId} from "../helpers/generateDeviceId";
import {hash,genSalt} from "bcrypt";
import {AddFunction, HashFunction, IdCreatorFunction, IsAfterFunction, SaltFunction} from "../models/mixedModels";
import generateId from "../helpers/generateId";
import {v4} from "uuid";
import {add, isAfter} from "date-fns"
export const iocContainer = new Container()
iocContainer.bind(BlogsController).to(BlogsController)
iocContainer.bind<UsersController>(UsersController).to(UsersController)
iocContainer.bind(PostsController).to(PostsController)
iocContainer.bind(SecurityController).to(SecurityController)
iocContainer.bind(AuthController).to(AuthController)
iocContainer.bind(TestingController).toSelf()
iocContainer.bind(JwtService).to(JwtService)
iocContainer.bind(BlogsService).to(BlogsService)
iocContainer.bind<UsersService>(UsersService).to(UsersService)
iocContainer.bind(PostsService).to(PostsService)
iocContainer.bind(CommentsService).to(CommentsService)
iocContainer.bind(AuthService).to(AuthService)
iocContainer.bind(SecurityService).to(SecurityService)
iocContainer.bind(Normalizer).toSelf()
iocContainer.bind<MailWorker>(MailWorker).to(MailWorker)
iocContainer.bind<QueryRepository>(QueryRepository).to(QueryRepository)
iocContainer.bind<CommandRepository>(CommandRepository).to(CommandRepository)
iocContainer.bind(Mail<SMTPTransport.SentMessageInfo>).toConstantValue(mailAdapter)
iocContainer.bind<Model<any>>("BlogModel").toConstantValue(Blogs)
iocContainer.bind<Model<any>>("PostModel").toConstantValue(Posts)
iocContainer.bind<Model<any>>("UserModel").toConstantValue(Users)
iocContainer.bind<Model<any>>("CommentModel").toConstantValue(Comments)
iocContainer.bind<Model<any>>("SessionModel").toConstantValue(Sessions)
iocContainer.bind<Model<any>>("AttemptModel").toConstantValue(Attempts)
iocContainer.bind<Model<any>>("LikeModel").toConstantValue(Likes)
iocContainer.bind<Function>("deviceIdGenerator").toFunction(generateDeviceId)
iocContainer.bind<HashFunction>('HashFunction').toFunction(hash)
iocContainer.bind<SaltFunction>('SaltFunction').toFunction(genSalt)
iocContainer.bind<IdCreatorFunction>("idGenerator").toFunction(generateId)
iocContainer.bind<Function>("UniqueCode").toFunction(v4)
iocContainer.bind<AddFunction>("AddFunction").toFunction(add)
iocContainer.bind<IsAfterFunction>("IsAfterFunction").toFunction(isAfter)