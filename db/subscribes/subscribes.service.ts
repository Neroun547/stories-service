import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Subscribes} from "./subscribes.entity";
import {EntityRepository} from "@mikro-orm/mysql";

@Injectable()
export class SubscribesServiceDb {
    constructor(@InjectRepository(Subscribes) private repository: EntityRepository<Subscribes>) {}

    async createSubscribe(userId: number, authorId: number) {
        await this.repository.nativeInsert({ user_id: userId, author_id: authorId });
    }
    async getSubscribeByUserIdAndAuthorId(userId: number, authorId: number) {
        return await this.repository.findOne({ user_id: userId, author_id: authorId });
    }
    async deleteSubscribe(userId: number, authorId: number) {
        await this.repository.nativeDelete({ user_id: userId, author_id: authorId });
    }
    async getSubscribesByUserId(userId: number) {
        return await this.repository.find({ user_id: userId }, { populate: ["author"] });
    }
}
