import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards} from "@nestjs/common";
import {SaveStoryDto} from "./dto/save-story.dto";
import {StoriesService} from "./service/stories.service";
import {AuthGuard} from "../auth/guards/auth.guard";
import {Request} from "express";
import {AddUsersToStoryPermissionsDto} from "./dto/add-users-to-story-permissions.dto";
import {ChangeStoryPermissionDto} from "./dto/change-story-permission.dto";
import {JwtService} from "@nestjs/jwt";
import {EditStoryDto} from "./dto/edit-story.dto";

@Controller()
export class StoriesController {
    constructor(private storiesService: StoriesService, private jwtService: JwtService) {};

    @UseGuards(AuthGuard)
    @Post()
    async saveStory(@Body() body: SaveStoryDto, @Req() req: Request) {
        await this.storiesService.saveStory(body, req['user'].id);

        return;
    }

    @Get()
    async getStories(@Query("skip", new ParseIntPipe()) skip: number, @Query("count", new ParseIntPipe()) count: number, @Req() req: Request) {
        return this.storiesService.checkStoriesPermissionsAndReturn(await this.storiesService.getStoriesAndAuthors(count, skip), req.headers.authorization);
    }

    @UseGuards(AuthGuard)
    @Get("permissions-users/:id")
    async getStoryPermissionsUsers(
        @Param("id", new ParseIntPipe()) storyId: number,
        @Req() req: Request
    ) {
        return await this.storiesService.getStoryPermissionsUsers(req["user"].id, storyId);
    }

    @Get("author-stories/:id")
    async getAuthorStoriesByUserId(
        @Param("id", new ParseIntPipe()) id: number,
        @Query("skip", new ParseIntPipe()) skip: number,
        @Query("count", new ParseIntPipe()) count: number,
        @Req() req: Request
    ) {
        return this.storiesService.checkStoriesPermissionsAndReturn(await this.storiesService.getStoriesByUserId(id, count, skip, "start_new"), req.headers.authorization);
    }

    @Get("search-by-theme-or-title/:themeOrTitle")
    async getStoriesByTitleOrTheme(
        @Param("themeOrTitle") themeOrTitle: string,
        @Query("count", new ParseIntPipe()) count: number,
        @Query("skip", new ParseIntPipe()) skip: number,
        @Req() req: Request
    ) {
        return await this.storiesService.checkStoriesPermissionsAndReturn(await this.storiesService.getStoriesByThemeOrTitle(themeOrTitle, count, skip), req);
    }

    @UseGuards(AuthGuard)
    @Get("my-stories")
    async getUserStories(
        @Req() req: Request,
        @Query("skip", new ParseIntPipe()) skip: number,
        @Query("count", new ParseIntPipe()) count: number,
        @Query("orderBy") orderBy: string
    ) {
        return await this.storiesService.getStoriesByUserId(req["user"].id, count, skip, orderBy);
    }

    @Get("get-story-info/:hash")
    async getStoryInfoByHash(@Param("hash") hash: string) {
        return await this.storiesService.getStoryInfoByHash(hash);
    }

    @UseGuards(AuthGuard)
    @Patch("edit-story/:hash")
    async editStoryByHash(@Body() body: EditStoryDto, @Param("hash") hash: string, @Req() req: Request) {
        await this.storiesService.editStoryByIdAndAuthorId(hash, req["user"].id, body.story, body.title, body.theme);

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("change-permission/:id")
    async changeStoryPermission(
        @Param("id", new ParseIntPipe()) storyId: number,
        @Body() body: ChangeStoryPermissionDto,
        @Req() req: Request,
    ) {
        await this.storiesService.changeStoryPermissionByStoryId(req["user"].id, storyId, body.permission);

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("add-users-to-story-permissions/:id")
    async addUsersToStoryPermissions(
        @Req() req: Request,
        @Body() body: AddUsersToStoryPermissionsDto,
        @Param("id", new ParseIntPipe()) storyId: number
    ) {
        await this.storiesService.addUsersToStoryPermissions(req["user"].id, storyId, body.users);

        return;
    }

    @UseGuards(AuthGuard)
    @Delete(":hash")
    async deleteStoryByHash(@Param("hash") hash: string, @Req() req: Request) {
        await this.storiesService.deleteStoryByAuthorIdAndHash(req["user"].id, hash);

        return;
    }

    @Get(":hash")
    async getStoryByHash(@Param("hash") hash: string, @Req() req: Request) {
        return { story: await this.storiesService.getStoryByHash(hash, req.headers.authorization) };
    }
}

