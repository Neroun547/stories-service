import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {StoriesPermissions} from "./stories-permissions.entity";
import {EntityRepository} from "@mikro-orm/mysql";

@Injectable()
export class StoriesPermissionsServiceDb {
    constructor(@InjectRepository(StoriesPermissions) private repository: EntityRepository<StoriesPermissions>) {}

    async savePermission(userId: number, storyId: number) {
        await this.repository.nativeInsert({ user_id: userId, story_id: storyId });
    }
    async deletePermissionsByStoryId(storyId: number) {
        await this.repository.nativeDelete({ story_id: storyId });
    }
    async getPermissionsByStoryId(storyId: number) {
        return await this.repository.find({ story_id: storyId }, { populate: ["user"] });
    }
}
