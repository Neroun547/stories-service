import {IsString, Length} from "class-validator";

export class EditStoryDto {
    @IsString()
    @Length(1)
    story: string;

    @IsString()
    @Length(1, 255)
    title: string;

    @IsString()
    @Length(1, 255)
    theme: string;
}
