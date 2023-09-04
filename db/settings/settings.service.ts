import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Settings} from "./settings.entity";
import {EntityRepository} from "@mikro-orm/mysql";

@Injectable()
export class SettingsServiceDb {
    constructor(@InjectRepository(Settings) private repository: EntityRepository<Settings>) {};

    async getSettingsByLanguageAndLikeKey(languageCode: string, key: string) {
        return await this.repository.find({ language: languageCode, setting_key: { $like: key } });
    }
}
