import { Module } from "@nestjs/common";
import {UsersModuleDb} from "../../db/users/users.module";
import {UsersController} from "./users.controller";
import {UsersService} from "./service/users.service";
import {CommonModule} from "../../common/common.module";

@Module({
    imports: [UsersModuleDb, CommonModule],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
