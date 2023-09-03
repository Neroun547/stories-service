import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {SubscribesInterface} from "./interfaces/subscribes.interface";
import {Users} from "../users/users.entity";

@Entity()
export class Subscribes implements SubscribesInterface {
    @PrimaryKey()
    id: number;

    @Property()
    author_id: number;

    @Property()
    user_id: number;

    @ManyToOne()
    user: Users;

    @ManyToOne()
    author: Users;
}
