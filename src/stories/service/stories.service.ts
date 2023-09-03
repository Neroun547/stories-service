import {Injectable, NotFoundException} from "@nestjs/common";
import {StoriesServiceDb} from "../../../db/stories/stories.service";
import {SaveStoryDto} from "../dto/save-story.dto";
import {CommonService} from "../../../common/common.service";
import { writeFile, readFile, unlink } from "fs/promises";
import { resolve } from "path";
import * as Moment from "moment";

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
            created_at: Moment().format("YYYY-MM-DD HH:MM:SS"),
            updated_at: Moment().format("YYYY-MM-DD HH:MM:SS")
        });

        await writeFile(resolve("stories/" + storyHash + ".html"), story.story);
    }
    async getStoriesByUserId(userId: number, count: number, skip: number) {
        const serializeData = JSON.parse(JSON.stringify(await this.storiesServiceDb.getStoriesAndAuthorByAuthorId(userId)));

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
        return (await this.storiesServiceDb.getStoriesAndAuthors(count, skip)).map(el => ({ ...el, author: { username: el.author.username, email: el.author.email } }));
    }
    async getStoriesByThemeOrTitle(themeOrTitle: string, count: number, skip: number) {
        return await this.storiesServiceDb.getStoriesLikeThemeOrTitle(themeOrTitle, count, skip);
    }
}
