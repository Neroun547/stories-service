import {IsString} from "class-validator";

export class SaveStoryDto {
    @IsString()
    story: string;

    @IsString()
    title: string;

    @IsString()
    theme: string;
}
