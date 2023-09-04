import { Injectable} from "@nestjs/common";
import {SettingsServiceDb} from "../../../db/settings/settings.service";

@Injectable()
export class SettingsService {
    constructor(private settingsServiceDb: SettingsServiceDb) {};

    async getTranslateByLanguage(language: string) {
        return await this.settingsServiceDb.getSettingsByLanguageAndLikeKey(language, "%" + "system.ui.translate" + "%");
    }
}
