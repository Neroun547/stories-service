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
           created_at: story.created_at,
           updated_at: story.updated_at
        });
    }
    async getStoriesAndAuthorByAuthorIdOrderByCreatedAt(authorId: number, count: number, skip: number, orderBy: string) {
        return await this.storiesRepository.find(
            { author_id: authorId },
            { populate: ["author"], orderBy: { created_at: orderBy }, limit: count, offset: skip }
        );
    }
    async deleteStoryByAuthorIdAndHashAndReturn(authorId: number, hash: string) {
        return await this.storiesRepository.nativeDelete({ author_id: authorId, story_hash: hash });
    }
    async getStoryInfoByHash(hash: string) {
        return await this.storiesRepository.findOne({ story_hash: hash }, { populate: ["author"] });
    }
    async getStoriesAndAuthorsDESCCreatedAt(count: number, skip: number) {
        return await this.storiesRepository.find({}, { offset: skip, limit: count, populate: ["author"], orderBy: { created_at: "DESC" } });
    }
    async getStoriesAndAuthorLikeThemeOrTitle(titleOrTheme: string, count: number, skip: number) {
        return await this.storiesRepository
            .createQueryBuilder()
            .joinAndSelect("author", "a")
            .where("title LIKE ?", ["%" + titleOrTheme + "%"])
            .orWhere("theme LIKE ?", ["%" + titleOrTheme + "%"])
            .limit(count)
            .offset(skip)
            .getResult();
    }
}
