import {Injectable, NotFoundException} from "@nestjs/common";
import {StoriesServiceDb} from "../../../db/stories/stories.service";
import {SaveStoryDto} from "../dto/save-story.dto";
import {CommonService} from "../../../common/common.service";
import { writeFile, readFile, unlink } from "fs/promises";
import { resolve } from "path";

@Injectable()
export class StoriesService {
    constructor(
        private storiesServiceDb: StoriesServiceDb,
        private commonService: CommonService
    ) {}

    async saveStory(story: SaveStoryDto, authorId: number) {
        const storyHash = this.commonService.generateRandomHash(String(Date.now() + Math.random() * 100000000), process.env.HASH_STORY_SECRET);

        await this.storiesServiceDb.saveStory({
            ...story,
            author_id: authorId,
            story_hash: storyHash,
            created_at: new Date(),
            updated_at: new Date()
        });

        await writeFile(resolve("stories/" + storyHash + ".html"), story.story);
    }
    async getStoriesByUserId(userId: number, count: number, skip: number, orderBy: string) {
        let serializeData;

        if(orderBy === "start_new" || !orderBy) {
            serializeData = JSON.parse(JSON.stringify(await this.storiesServiceDb.getStoriesAndAuthorByAuthorIdOrderByCreatedAt(userId, count, skip, "DESC")));
        }
        if(orderBy === "start_old") {
            serializeData = JSON.parse(JSON.stringify(await this.storiesServiceDb.getStoriesAndAuthorByAuthorIdOrderByCreatedAt(userId, count, skip, "ASC")));
        }
        if(!serializeData) {
            throw new NotFoundException({ message: "Stories not found" });
        }
        return serializeData.map(el => ({ ...el, author: { username: el.author.username } }));
    }
    async deleteStoryByAuthorIdAndHash(authorId: number, hash) {
        const deleteCount = await this.storiesServiceDb.deleteStoryByAuthorIdAndHashAndReturn(authorId, hash);

        if(deleteCount) {
            try {
                await unlink(resolve("stories/" + hash + ".html"));
            } catch (e) {
                throw new NotFoundException({ message: "File not found" });
            }
        }
    }
    async getStoryByHash(storyHash: string) {
        return (await readFile(resolve("stories/" + storyHash + ".html"))).toString();
    }
    async getStoryInfoByHash(hash: string) {
        const serializeData = JSON.parse(JSON.stringify(await this.storiesServiceDb.getStoryInfoByHash(hash)));

        return { ...serializeData, author: { username: serializeData.author.username, email: serializeData.author.email } };
    }
    async getStoriesAndAuthors(count: number, skip: number) {
        return (await this.storiesServiceDb.getStoriesAndAuthorsDESCCreatedAt(count, skip)).map(el => ({ ...el, author: { username: el.author.username, email: el.author.email } }));
    }
    async getStoriesByThemeOrTitle(themeOrTitle: string, count: number, skip: number) {
        return await this.storiesServiceDb.getStoriesAndAuthorLikeThemeOrTitle(themeOrTitle, count, skip);
    }
}
