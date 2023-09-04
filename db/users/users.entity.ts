import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {UsersInterface} from "./interfaces/users.interface";

@Entity()
export class Users implements UsersInterface {
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @Property()
    username: string;

    @Property()
    email: string;

    @Property()
    password: string;

    @Property()
    avatar: string;

    @Property({ default: "uk" })
    language: string;
}
