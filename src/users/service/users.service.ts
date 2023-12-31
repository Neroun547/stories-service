import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UsersServiceDb} from "../../../db/users/users.service";
import {ChangeUsersParamsDto} from "../dto/change-users-params.dto";
import * as argon2 from "argon2";
import {JwtService} from "@nestjs/jwt";
import {JWT_CONSTANTS} from "../../auth/constants/constants";
import {CommonService} from "../../../common/common.service";
import { writeFile, unlink } from "fs/promises";
import { resolve } from "path";
import {SubscribesServiceDb} from "../../../db/subscribes/subscribes.service";

@Injectable()
export class UsersService {
    constructor(
        private usersServiceDb: UsersServiceDb,
        private jwtService: JwtService,
        private commonService: CommonService,
        private subscribesServiceDb: SubscribesServiceDb
    ) {}

    async changeUserParamsById(userId: number, newParams: ChangeUsersParamsDto, avatar: Express.Multer.File): Promise<string> {
        const user = await this.usersServiceDb.getUserById(userId);
        let avatarName;

        if(avatar && (avatar.mimetype === "image/jpg" || avatar.mimetype === "image/png" || avatar.mimetype === "image/jpeg")) {

            avatarName = this.commonService.generateRandomHash(String(Date.now() + Math.random() * 100000000), process.env.HASH_AVATAR_SECRET);

            if(avatar.mimetype === "image/png") {
                avatarName += ".png";
                await writeFile(resolve("stories-service-client/public/avatars/" + avatarName), avatar.buffer);
            }
            if(avatar.mimetype === "image/jpg") {
                avatarName += ".jpg";
                await writeFile(resolve("stories-service-client/public/avatars/" + avatarName), avatar.buffer);
            }
            if(avatar.mimetype === "image/jpeg") {
                avatarName += ".jpeg";
                await writeFile(resolve("stories-service-client/public/avatars/" + avatarName), avatar.buffer);
            }
            if(user.avatar) {
                try {
                    unlink(resolve("stories-service-client/public/avatars/" + user.avatar));
                } catch (e) {
                    throw new NotFoundException({message: "Old avatar not found"})
                }
            }
        }
        if(avatar && (avatar.mimetype !== "image/jpg" && avatar.mimetype !== "image/png" && avatar.mimetype !== "image/jpeg")) {
            throw new BadRequestException({ message: "system.ui.translate.error.invalid_file_extension" });
        }
        const userWithTheSameEmailOrUsername = (await this.usersServiceDb.getUserByUsernameOrEmail(newParams.username, newParams.email)).filter((el) => el.id !== userId);

        if(userWithTheSameEmailOrUsername.length && userWithTheSameEmailOrUsername[0].email === newParams.email) {
            throw new BadRequestException({ message: "system.ui.translate.error.user_with_this_email_already_exists" });
        }
        if(userWithTheSameEmailOrUsername.length && userWithTheSameEmailOrUsername[0].username === newParams.username) {
            throw new BadRequestException({ message: "system.ui.translate.error.user_with_this_username_already_exists" });
        }
        if(newParams.oldPassword && newParams.newPassword) {
            const verifyPassword = await argon2.verify(user.password, newParams.oldPassword);

            if (!verifyPassword) {
                throw new BadRequestException( { message: "system.ui.translate.error.invalid_old_password" });
            }
            await this.usersServiceDb.changeUserParamsById(userId, {
                name: newParams.name,
                username: newParams.username,
                email: newParams.email,
                password: await argon2.hash(newParams.newPassword),
                avatar: avatarName ? avatarName : user.avatar
            });
        } else {
            await this.usersServiceDb.changeUserParamsById(userId, {
                name: newParams.name,
                username: newParams.username,
                email: newParams.email,
                avatar: avatarName ? avatarName : user.avatar
            });
        }
        return await this.jwtService.signAsync({
            id: userId, name: newParams.name,
            username: newParams.username,
            email: newParams.email,
            avatar: avatarName ? avatarName : user.avatar
        }, { secret: JWT_CONSTANTS.secret });
    }

    async getUserByUsernameOrEmail(usernameOrEmail: string, skip: number, count: number) {
        const serializeData = JSON.parse(JSON.stringify(await this.usersServiceDb.getUserLikeUsernameOrEmail(usernameOrEmail, skip, count)));

        return serializeData.map(el => {
           delete el.password;

           return el;
        });
    }

    async getUserInfoById(id: number) {
        const serializeData = JSON.parse(JSON.stringify(await this.usersServiceDb.getUserById(id)));

        delete serializeData.password;

        return serializeData;
    }

    async createSubscribe(userId: number, authorId: number) {
        const subscribeInDb = await this.subscribesServiceDb.getSubscribeByUserIdAndAuthorId(userId, authorId);

        if(subscribeInDb) {
            throw new BadRequestException({ message: "Subscribe already exists" });
        }
        await this.subscribesServiceDb.createSubscribe(userId, authorId);
    }

    async getUserSubscribeByAuthorId(userId: number, authorId: number) {
        return await this.subscribesServiceDb.getSubscribeByUserIdAndAuthorId(userId, authorId);
    }

    async deleteSubscribe(userId: number, authorId: number) {
        await this.subscribesServiceDb.deleteSubscribe(userId, authorId);
    }

    async getSubscribesByUserId(userId: number, skip: number, count: number) {
        const serializedData = JSON.parse(JSON.stringify(await this.subscribesServiceDb.getSubscribesByUserId(userId, skip, count)));

        return serializedData.map((el) => ({ ...el.author }));
    }

    async changeUserLanguageById(userId: number, language: string) {
        await this.usersServiceDb.changeUserLanguageById(userId, language);
    }

    async deleteUserAvatarByUserId(userId: number): Promise<string> {
        const user = await this.usersServiceDb.getUserById(userId);

        try {
            await unlink("stories-service-client/public/avatars/" + user.avatar)
        } catch(e) {
            throw new NotFoundException({ message: "Avatar not found" });
        }
        await this.usersServiceDb.changeUserParamsById(userId, { ...user, avatar: null });

        return await this.jwtService.signAsync({ id: userId, name: user.name, username: user.username, email: user.email, avatar: null }, { secret: JWT_CONSTANTS.secret });
    }
}
