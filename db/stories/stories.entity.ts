import {Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {Users} from "../users/users.entity";
import {StoriesInterface} from "./interfaces/stories.interface";
import { DateType } from "../types/date.type";

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

    @Property({ type: DateType })
    created_at: Date | string;

    @Property({ type: DateType })
    updated_at: Date | string;

    @ManyToOne()
    author: Users
}
