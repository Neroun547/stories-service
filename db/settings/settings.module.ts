import { Module } from "@nestjs/common";
import {SettingsServiceDb} from "./settings.service";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Settings} from "./settings.entity";

@Module({
    imports: [MikroOrmModule.forFeature([Settings])],
    providers: [SettingsServiceDb],
    exports: [SettingsServiceDb]
})
export class SettingsModuleDb {}
