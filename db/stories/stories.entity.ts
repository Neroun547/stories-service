import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {Users} from "../users/users.entity";
import {StoriesInterface} from "./interfaces/stories.interface";

@Entity()
export class Stories implements StoriesInterface {
    @PrimaryKey()
    id: number;

    @Property()
    story_hash: string;

    @Property()
    author_id: number;

    @Property()
    title: string;

    @Property()
    theme: string;

    @ManyToOne()
    author: Users
}
