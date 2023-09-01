import {Body, Controller, Patch, Req, UseGuards} from "@nestjs/common";
import {UsersService} from "./service/users.service";
import {ChangeUsersParamsDto} from "./dto/change-users-params.dto";
import { Request } from "express";
import {AuthGuard} from "../auth/guards/auth.guard";

@Controller()
export class UsersController {
    constructor(private usersService: UsersService) {};

    @UseGuards(AuthGuard)
    @Patch()
    async changeUsersParams(
        @Req() req: Request,
        @Body() body: ChangeUsersParamsDto
    ) {
        return { token: await this.usersService.changeUserParamsById(req["user"].id, body) };
    }
}
