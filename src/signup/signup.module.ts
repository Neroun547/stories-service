import { Module } from "@nestjs/common";
import {UsersModuleDb} from "../../db/users/users.module";
import {SignupService} from "./service/signup.service";
import {SignupController} from "./signup.controller";

@Module({
    imports: [UsersModuleDb],
    providers: [SignupService],
    controllers: [SignupController]
})
export class SignupModule {}
