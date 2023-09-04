import {Controller, Get, Param} from "@nestjs/common";
import {SettingsService} from "./service/settings.service";

@Controller()
export class SettingsController {
    constructor(private settingsService: SettingsService) {}

    @Get("translate/:language")
    async getTranslateByLanguage(@Param("language") language: string) {
        return await this.settingsService.getTranslateByLanguage(language);
    }
}
