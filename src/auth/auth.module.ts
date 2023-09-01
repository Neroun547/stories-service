import { Module } from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {JWT_CONSTANTS} from "./constants/constants";
import {UsersModuleDb} from "../../db/users/users.module";
import {AuthController} from "./auth.controller";
import {AuthService} from "./service/auth.service";

@Module({
    imports: [
        JwtModule.register({
            secret: JWT_CONSTANTS.secret,
            global: JWT_CONSTANTS.global,
            signOptions: { expiresIn: JWT_CONSTANTS.expiresIn }
        }),
        UsersModuleDb
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
