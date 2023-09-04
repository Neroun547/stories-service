import {
    Body,
    Controller, Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch, Post,
    Query,
    Req, UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {UsersService} from "./service/users.service";
import {ChangeUsersParamsDto} from "./dto/change-users-params.dto";
import { Request } from "express";
import {AuthGuard} from "../auth/guards/auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller()
export class UsersController {
    constructor(private usersService: UsersService) {};

    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    @Patch()
    async changeUsersParams(
        @Req() req: Request,
        @Body() body,
        @UploadedFile() avatar: Express.Multer.File
    ) {
        return { token: await this.usersService.changeUserParamsById(req["user"].id, body, avatar) };
    }

    @Get("search-by-username-or-email/:usernameOrEmail")
    async getUserByUsernameOrEmail(
        @Param("usernameOrEmail") usernameOrEmail: string,
        @Query("skip", new ParseIntPipe()) skip: number,
        @Query("count", new ParseIntPipe()) count: number
    ) {
        return await this.usersService.getUserByUsernameOrEmail(usernameOrEmail, skip, count);
    }

    @UseGuards(AuthGuard)
    @Post("subscribe/:authorId")
    async createSubscribe(@Req() req: Request, @Param("authorId", new ParseIntPipe()) authorId: number) {
        await this.usersService.createSubscribe(req["user"].id, authorId);

        return;
    }

    @UseGuards(AuthGuard)
    @Delete("subscribe/:authorId")
    async deleteSubscribe(@Req() req: Request, @Param("authorId", new ParseIntPipe()) authorId: number) {
        await this.usersService.deleteSubscribe(req["user"].id, authorId);

        return;
    }

    @UseGuards(AuthGuard)
    @Get("subscribes")
    async getSubscribes(@Req() req: Request, @Query("skip", new ParseIntPipe()) skip: number, @Query("count", new ParseIntPipe()) count: number) {
        return await this.usersService.getSubscribesByUserId(req["user"].id, skip, count);
    }

    @UseGuards(AuthGuard)
    @Get("subscribe-user-by-author-id/:authorId")
    async getSubscribeUserByAuthorId(@Req() req: Request, @Param("authorId", new ParseIntPipe()) authorId: number) {
        return await this.usersService.getUserSubscribeByAuthorId(req["user"].id, authorId);
    }

    @UseGuards(AuthGuard)
    @Patch("change-language/:language")
    async changeLanguage(@Req() req: Request, @Param("language") language: string) {
        await this.usersService.changeUserLanguageById(req["user"].id, language);

        return;
    }

    @Get(":id")
    async getUserInfoById(@Param("id", new ParseIntPipe()) id: number) {
        return await this.usersService.getUserInfoById(id);
    }
}
