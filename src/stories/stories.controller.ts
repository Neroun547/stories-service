import {Body, Controller, Post, UseGuards, Req, Get, Delete, Param, ParseIntPipe, Query} from "@nestjs/common";
import {SaveStoryDto} from "./dto/save-story.dto";
import {StoriesService} from "./service/stories.service";
import {AuthGuard} from "../auth/guards/auth.guard";
import { Request } from "express";

@Controller()
export class StoriesController {
    constructor(private storiesService: StoriesService) {};

    @UseGuards(AuthGuard)
    @Post()
    async saveStory(@Body() body: SaveStoryDto, @Req() req: Request) {
        await this.storiesService.saveStory(body, req['user'].id);

        return;
    }

    @Get()
    async getStories(@Query("skip", new ParseIntPipe()) skip: number, @Query("count", new ParseIntPipe()) count: number) {
        return await this.storiesService.getStoriesAndAuthors(count, skip);
    }

    @UseGuards(AuthGuard)
    @Get("my-stories")
    async getUserStories(@Req() req: Request) {
        return await this.storiesService.getStoriesByUserId(req["user"].id);
    }

    @Get("get-story-info/:hash")
    async getStoryInfoByHash(@Param("hash") hash: string) {
        return await this.storiesService.getStoryInfoByHash(hash);
    }

    @UseGuards(AuthGuard)
    @Delete(":hash")
    async deleteStoryByHash(@Param("hash") hash: string, @Req() req: Request) {
        await this.storiesService.deleteStoryByAuthorIdAndHash(req["user"].id, hash);

        return;
    }

    @Get(":hash")
    async getStoryByHash(@Param("hash") hash: string) {
        return { story: await this.storiesService.getStoryByHash(hash) };
    }
}

