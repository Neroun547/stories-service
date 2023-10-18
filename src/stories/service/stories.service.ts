import {BadRequestException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {StoriesServiceDb} from "../../../db/stories/stories.service";
import {SaveStoryDto} from "../dto/save-story.dto";
import {CommonService} from "../../../common/common.service";
import {readFile, unlink, writeFile} from "fs/promises";
import {resolve} from "path";
import {StoriesPermissionsServiceDb} from "../../../db/stories-permissions/stories-permissions.service";
import {JwtService} from "@nestjs/jwt";
import {JWT_CONSTANTS} from "../../auth/constants/constants";

@Injectable()
export class StoriesService {
    constructor(
        private storiesServiceDb: StoriesServiceDb,
        private commonService: CommonService,
        private storiesPermissionsServiceDb: StoriesPermissionsServiceDb,
        private jwtService: JwtService
    ) {}

    async checkStoriesPermissionsAndReturn(data, jwtToken) {
        try {
            const viewerUserId = (await this.jwtService.verifyAsync(jwtToken.replace("Bearer ", ""), {secret: JWT_CONSTANTS.secret})).id;

            return data.map(el => {
                if (el.author_id === viewerUserId) {
                    return el;
                }
                if (el.permission === "private" && el.permissions.find(el => el.user_id === viewerUserId)) {
                    return el;
                }
                if (el.permission === "public") {
                    return el;
                }
            }).filter(el => el !== undefined);
        } catch(e) {
            return data.map(el => {
                if(el.permission === "public") {
                    return el;
                }
            }).filter(el => el !== undefined);
        }
    }

    async saveStory(story: SaveStoryDto, authorId: number) {
        const storyHash = this.commonService.generateRandomHash(String(Date.now() + Math.random() * 100000000), process.env.HASH_STORY_SECRET);

        await this.storiesServiceDb.saveStory({
            ...story,
            author_id: authorId,
            story_hash: storyHash,
            created_at: new Date(),
            updated_at: new Date(),
            permission: story.permission
        });

        await writeFile(resolve("stories/" + storyHash + ".html"), story.story);
    }
    async getStoriesByUserId(userId: number, count: number, skip: number, orderBy: string) {
        let serializeData;

        if(orderBy === "start_new" || !orderBy) {
            serializeData = JSON.parse(JSON.stringify(await this.storiesServiceDb.getStoriesAndAuthorAndPermissionsByAuthorIdOrderByCreatedAt(userId, count, skip, "DESC")));
        }
        if(orderBy === "start_old") {
            serializeData = JSON.parse(JSON.stringify(await this.storiesServiceDb.getStoriesAndAuthorAndPermissionsByAuthorIdOrderByCreatedAt(userId, count, skip, "ASC")));
        }
        if(!serializeData) {
            throw new NotFoundException({ message: "Stories not found" });
        }
        return serializeData.map(el => ({ ...el, author: { username: el.author.username } }));
    }
    async deleteStoryByAuthorIdAndHash(authorId: number, hash) {
        const story = await this.storiesServiceDb.getStoryInfoByHash(hash);

        await this.storiesPermissionsServiceDb.deletePermissionsByStoryId(story.id);

        const deleteCount = await this.storiesServiceDb.deleteStoryByAuthorIdAndHashAndReturn(authorId, hash);

        if(deleteCount) {
            try {
                await unlink(resolve("stories/" + hash + ".html"));
            } catch (e) {
                throw new NotFoundException({ message: "File not found" });
            }
        }
    }
    async getStoryByHash(storyHash: string, jwtToken: string) {
        const storyInDb = await this.storiesServiceDb.getStoryInfoByHash(storyHash);

        if(storyInDb.permission === "private") {
            if((await this.checkStoriesPermissionsAndReturn([JSON.parse(JSON.stringify(storyInDb))], jwtToken)).length) {
                return (await readFile(resolve("stories/" + storyHash + ".html"))).toString();
            }
            throw new ForbiddenException();
        } else {
            return (await readFile(resolve("stories/" + storyHash + ".html"))).toString();
        }
    }
    async getStoryInfoByHash(hash: string) {
        const serializeData = JSON.parse(JSON.stringify(await this.storiesServiceDb.getStoryInfoByHash(hash)));

        return { ...serializeData, author: { username: serializeData.author.username, email: serializeData.author.email } };
    }
    async getStoriesAndAuthors(count: number, skip: number) {
        const data = (await this.storiesServiceDb.getStoriesAndAuthorsAndPermissionsDESCCreatedAt(count, skip)).map(el => ({ ...el, author: { username: el.author.username, email: el.author.email } }))

        return JSON.parse(JSON.stringify(data));
    }
    async getStoriesByThemeOrTitle(themeOrTitle: string, count: number, skip: number) {
        return JSON.parse(JSON.stringify(await this.storiesServiceDb.getStoriesAndAuthorAndPermissionsLikeThemeOrTitle(themeOrTitle, count, skip)));
    }
    async addUsersToStoryPermissions(authorId: number, storyId: number, users: Array<number>) {
        const storyInDb = await this.storiesServiceDb.getStoryByIdAndAuthorId(authorId, storyId);

        if(!storyInDb) {
            throw new NotFoundException();
        }
        await this.storiesPermissionsServiceDb.deletePermissionsByStoryId(storyId);

        for(let i = 0; i < users.length; i++) {
            await this.storiesPermissionsServiceDb.savePermission(users[i], storyId);
        }
    }
    async changeStoryPermissionByStoryId(authorId: number, storyId: number, permission: boolean) {

        if(permission) {
            const storyInDb = await this.storiesServiceDb.getStoryByIdAndAuthorId(authorId, storyId);

            if(!storyInDb) {
                throw new BadRequestException();
            }
            await this.storiesPermissionsServiceDb.deletePermissionsByStoryId(storyId);
            await this.storiesServiceDb.changePermissionStoryByIdAndAuthorId(authorId, storyId, "public");
        } else {
            await this.storiesServiceDb.changePermissionStoryByIdAndAuthorId(authorId, storyId, "private");
        }
    }
    async getStoryPermissionsUsers(authorId: number, storyId: number) {
        const storyInDb = await this.storiesServiceDb.getStoryByIdAndAuthorId(authorId, storyId);
        const serializedData = JSON.parse(JSON.stringify(await this.storiesPermissionsServiceDb.getPermissionsByStoryId(storyId)));

        if(!storyInDb) {
            throw new NotFoundException();
        }
        return serializedData.map(el => ({ id: el.user.id, username: el.user.username, email: el.user.email, avatar: el.user.avatar }));
    }
    async editStoryByIdAndAuthorId(hash: string, authorId: number, story: string, title: string, theme: string) {
        const storyInDb = await this.storiesServiceDb.getStoryByHashAndAuthorId(hash, authorId);

        if(storyInDb) {
            await this.storiesServiceDb.updateStoryByHashAndAuthorId(hash, authorId, title, theme);

            try {
                await writeFile(resolve("stories/" + storyInDb.story_hash + ".html"), story);
            } catch (e) {
                throw new NotFoundException({ message: "File not found" });
            }
            return;
        }
        throw new NotFoundException();
    }
}
