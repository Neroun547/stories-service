import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Users} from "./users.entity";
import {EntityRepository} from "@mikro-orm/mysql";
import {UsersInterface} from "./interfaces/users.interface";
import {UpdateUserInterface} from "./interfaces/update-user.interface";

@Injectable()
export class UsersServiceDb {
    constructor(@InjectRepository(Users) private repository: EntityRepository<Users>) {}

    async createUser(user: UsersInterface) {
        await this.repository.nativeInsert(user);
    }
    async getUserByUsernameOrEmail(username: string, email: string) {
        return await this.repository
            .createQueryBuilder()
            .select("*")
            .where("username = ?", [username])
            .orWhere("email = ?", [email])
            .getResult();
    }
    async changeUserParamsById(id: number, user: UpdateUserInterface) {
        await this.repository.nativeUpdate({ id: id }, { ...user });
    }
    async getUserById(id: number) {
        return await this.repository.findOne({ id: id });
    }
}
