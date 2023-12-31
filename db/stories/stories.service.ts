import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Stories} from "./stories.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {StoriesInterface} from "./interfaces/stories.interface";

@Injectable()
export class StoriesServiceDb {
    constructor(@InjectRepository(Stories) private storiesRepository: EntityRepository<Stories>) {}

    async saveStory(story: StoriesInterface) {
        await this.storiesRepository.nativeInsert({
           title: story.title,
           theme: story.theme,
           story_hash: story.story_hash,
           author_id: story.author_id,
           permission: story.permission,
           created_at: story.created_at,
           updated_at: story.updated_at
        });
    }
    async getStoriesAndAuthorAndPermissionsByAuthorIdOrderByCreatedAt(authorId: number, count: number, skip: number, orderBy: string) {
        return await this.storiesRepository.find(
            { author_id: authorId },
            { populate: ["author", "permissions"], orderBy: { created_at: orderBy }, limit: count, offset: skip }
        );
    }
    async deleteStoryByAuthorIdAndHashAndReturn(authorId: number, hash: string) {
        return await this.storiesRepository.nativeDelete({ author_id: authorId, story_hash: hash });
    }
    async getStoryInfoByHash(hash: string) {
        return await this.storiesRepository.findOne({ story_hash: hash }, { populate: ["author", "permissions"] });
    }
    async getStoriesAndAuthorsAndPermissionsDESCCreatedAt(count: number, skip: number) {
        return await this.storiesRepository.find({}, { offset: skip, limit: count, populate: ["author", "permissions"], orderBy: { created_at: "DESC" } });
    }
    async getStoriesAndAuthorAndPermissionsLikeThemeOrTitle(titleOrTheme: string, count: number, skip: number) {
        return await this.storiesRepository
            .createQueryBuilder()
            .joinAndSelect("author", "a")
            .joinAndSelect("permissions", "p")
            .where("title LIKE ?", ["%" + titleOrTheme + "%"])
            .orWhere("theme LIKE ?", ["%" + titleOrTheme + "%"])
            .limit(count)
            .offset(skip)
            .getResult();
    }
    async changePermissionStoryByIdAndAuthorId(authorId: number, storyId: number, permission: string) {
        await this.storiesRepository.nativeUpdate({ author_id: authorId, id: storyId }, { permission: permission });
    }
    async getStoryByIdAndAuthorId(authorId: number, id: number) {
        return await this.storiesRepository.findOne({ id: id, author_id: authorId });
    }
    async updateStoryByHashAndAuthorId(hash: string, authorId: number, title: string, theme: string) {
        await this.storiesRepository.nativeUpdate({ story_hash: hash, author_id: authorId }, { title: title, theme: theme });
    }
    async getStoryByHashAndAuthorId(hash: string, authorId: number) {
        return await this.storiesRepository.findOne({ story_hash: hash, author_id: authorId });
    }
}
