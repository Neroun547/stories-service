import { Module } from "@nestjs/common";
import {StoriesModuleDb} from "../../db/stories/stories.module";
import {StoriesService} from "./service/stories.service";
import {StoriesController} from "./stories.controller";
import {CommonModule} from "../../common/common.module";
import {StoriesPermissionsModuleDb} from "../../db/stories-permissions/stories-permissions.module";

@Module({
    imports: [StoriesModuleDb, CommonModule, StoriesPermissionsModuleDb],
    providers: [StoriesService],
    controllers: [StoriesController]
})
export class StoriesModule {}
