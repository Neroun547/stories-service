import { Module } from "@nestjs/common";
import {UsersModuleDb} from "../../db/users/users.module";
import {UsersController} from "./users.controller";
import {UsersService} from "./service/users.service";
import {CommonModule} from "../../common/common.module";
import {SubscribesModuleDb} from "../../db/subscribes/subscribes.module";

@Module({
    imports: [UsersModuleDb, CommonModule, SubscribesModuleDb],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
