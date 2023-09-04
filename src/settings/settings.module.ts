import { Module } from "@nestjs/common";
import {SettingsService} from "./service/settings.service";
import {SettingsController} from "./settings.controller";
import {SettingsModuleDb} from "../../db/settings/settings.module";

@Module({
    imports: [SettingsModuleDb],
    providers: [SettingsService],
    controllers: [SettingsController]
})
export class SettingsModule {}
