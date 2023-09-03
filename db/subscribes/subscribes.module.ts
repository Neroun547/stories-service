import { Module } from "@nestjs/common";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Subscribes} from "./subscribes.entity";
import {SubscribesServiceDb} from "./subscribes.service";

@Module({
    imports: [MikroOrmModule.forFeature([Subscribes])],
    providers: [SubscribesServiceDb],
    exports: [SubscribesServiceDb]
})
export class SubscribesModuleDb {}
