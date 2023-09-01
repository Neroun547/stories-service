import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Stories} from "./stories.entity";
import {StoriesServiceDb} from "./stories.service";

@Module({
    imports: [MikroOrmModule.forFeature([Stories])],
    providers: [StoriesServiceDb],
    exports: [StoriesServiceDb]
})
export class StoriesModuleDb {}
