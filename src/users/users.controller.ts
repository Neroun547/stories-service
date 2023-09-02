import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
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

    @Get(":id")
    async getUserInfoById(@Param("id", new ParseIntPipe()) id: number) {
        return await this.usersService.getUserInfoById(id);
    }
}
