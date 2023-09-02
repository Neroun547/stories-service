import {Body, Controller, Get, Post, Req, UseGuards} from "@nestjs/common";
import {AuthDto} from "./dto/auth.dto";
import {AuthService} from "./service/auth.service";
import {JwtService} from "@nestjs/jwt";
import {AuthGuard} from "./guards/auth.guard";
import { Request } from "express";

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService
    ) {};

    @Post()
    async auth(@Body() body: AuthDto) {
        const { token, avatar } = await this.authService.auth(body);

        return { token: token, avatar: avatar };
    }

    @UseGuards(AuthGuard)
    @Get()
    checkToken() {
        return;
    }

    @UseGuards(AuthGuard)
    @Get("user-info")
    getUserInfo(@Req() req: Request) {
        return req["user"];
    }

}
