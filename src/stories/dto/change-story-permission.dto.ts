import {IsBoolean} from "class-validator";

export class ChangeStoryPermissionDto {
    @IsBoolean()
    permission: boolean;
}
