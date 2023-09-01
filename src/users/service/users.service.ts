import {BadRequestException, Injectable} from "@nestjs/common";
import {UsersServiceDb} from "../../../db/users/users.service";
import {ChangeUsersParamsDto} from "../dto/change-users-params.dto";
import * as argon2 from "argon2";
import {JwtService} from "@nestjs/jwt";
import {JWT_CONSTANTS} from "../../auth/constants/constants";

@Injectable()
export class UsersService {
    constructor(
        private usersServiceDb: UsersServiceDb,
        private jwtService: JwtService
    ) {}

    async changeUserParamsById(userId: number, newParams: ChangeUsersParamsDto): Promise<string> {
        const userWithTheSameEmailOrUsername = (await this.usersServiceDb.getUserByUsernameOrEmail(newParams.username, newParams.email)).filter((el) => el.id !== userId);

        if(userWithTheSameEmailOrUsername.length &&
            userWithTheSameEmailOrUsername[0].email === newParams.email)
        {
            throw new BadRequestException({ message: "User with the same email already exists" });
        }
        if(userWithTheSameEmailOrUsername.length &&
            userWithTheSameEmailOrUsername[0].username === newParams.username)
        {
            throw new BadRequestException({ message: "User with the same username already exists" });
        }
        if(newParams.oldPassword && newParams.newPassword) {
            const user = await this.usersServiceDb.getUserById(userId);
            const verifyPassword = await argon2.verify(user.password, newParams.oldPassword);

            if (!verifyPassword) {
                throw new BadRequestException( { message: "Invalid old password" });
            }
            await this.usersServiceDb.changeUserParamsById(userId, {
                name: newParams.name,
                username: newParams.username,
                email: newParams.email,
                password: await argon2.hash(newParams.newPassword)
            });
        } else {
            await this.usersServiceDb.changeUserParamsById(userId, {
                name: newParams.name,
                username: newParams.username,
                email: newParams.email
            });
        }
        return await this.jwtService.signAsync({ id: userId, name: newParams.name, username: newParams.username, email: newParams.email }, { secret: JWT_CONSTANTS.secret });
    }
}
