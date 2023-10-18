import { Entity, ManyToOne, PrimaryKey, Property} from "@mikro-orm/core";
import {StoriesPermissionsInterface} from "./interfaces/stories-permissions.interface";
import {Users} from "../users/users.entity";
import {Stories} from "../stories/stories.entity";

@Entity()
export class StoriesPermissions implements StoriesPermissionsInterface {
    @PrimaryKey()
    id: number;

    @Property()
    user_id: number;

    @Property()
    story_id: number;

    @ManyToOne()
    user: Users;

    @ManyToOne({ entity: () => Stories })
    story: Stories
}

