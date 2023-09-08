import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {UsersServiceDb} from "../../../db/users/users.service";
import {AuthDto} from "../dto/auth.dto";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import {JWT_CONSTANTS} from "../constants/constants";

@Injectable()
export class AuthService {
    constructor(
        private usersServiceDb: UsersServiceDb,
        private jwtService: JwtService
    ) {}

    async auth(user: AuthDto) {
        const userInDb = JSON.parse(JSON.stringify(await this.usersServiceDb.getUserByUsernameOrEmail(user.usernameOrEmail, user.usernameOrEmail)));

        if(!userInDb.length) {
            throw new NotFoundException({ message: "system.ui.translate.error.user_with_this_params_not_found" });
        }
        const checkPassword = await argon2.verify(userInDb[0].password, user.password);

        if(checkPassword) {
            delete userInDb[0].password;

            return { token: await this.jwtService.signAsync(userInDb[0], { secret: JWT_CONSTANTS.secret }), avatar: userInDb[0].avatar };
        }
        throw new ForbiddenException({ message: "system.ui.translate.error.wrong_password" });
    }
}
