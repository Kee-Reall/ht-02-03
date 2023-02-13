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

export const userContainer = new Container()
userContainer.bind<UsersController>(UsersController).to(UsersController)
userContainer.bind<UsersService>(UsersService).to(UsersService)
userContainer.bind<QueryRepository>(QueryRepository).to(QueryRepository)
userContainer.bind<CommandRepository>(CommandRepository).to(CommandRepository)
userContainer.bind<MailWorker>(MailWorker).to(MailWorker)
userContainer.bind(JwtService).to(JwtService)
userContainer.bind(AuthService).to(AuthService)
userContainer.bind(AuthController).to(AuthController)
userContainer.bind(SecurityService).to(SecurityService)
userContainer.bind(SecurityController).to(SecurityController)
userContainer.bind(Normalizer).toSelf()