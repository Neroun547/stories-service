import { Module } from "@nestjs/common";
import {UsersModuleDb} from "../../db/users/users.module";
import {UsersController} from "./users.controller";
import {UsersService} from "./service/users.service";

@Module({
    imports: [UsersModuleDb],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
