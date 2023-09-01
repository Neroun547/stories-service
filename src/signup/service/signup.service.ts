import {BadRequestException, Injectable} from "@nestjs/common";
import {SignupDto} from "../dto/signup.dto";
import {UsersServiceDb} from "../../../db/users/users.service";
import * as argon2 from "argon2";

@Injectable()
export class SignupService {
    constructor(private usersServiceDb: UsersServiceDb) {};

    async signup(user: SignupDto) {
        user.username = user.username.replace(/ /g, "");
        user.email = user.email.replace(/ /g, "");
        user.name = user.name.replace(/ /g, "");

        const userInDb = await this.usersServiceDb.getUserByUsernameOrEmail(user.username, user.email);

        if(userInDb.length && userInDb[0].email.toLowerCase() === user.email.toLowerCase()) {
            throw new BadRequestException({ message: "User with the same email already exists" });
        }
        if(userInDb.length && userInDb[0].username.toLowerCase() === user.username.toLowerCase()) {
            throw new BadRequestException({ message: "User with the same username already exists" });
        }
        const passwordHash = await argon2.hash(user.password);

        await this.usersServiceDb.createUser({
            username: user.username,
            email: user.email,
            name: user.name,
            password: passwordHash
        });
    }
}
