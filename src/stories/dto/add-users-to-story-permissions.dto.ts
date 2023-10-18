import { IsArray } from "class-validator";

export class AddUsersToStoryPermissionsDto {
    @IsArray()
    users: Array<number>;
}
