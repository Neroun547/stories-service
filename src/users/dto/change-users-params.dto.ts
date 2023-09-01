import {IsEmail, IsOptional, IsString} from "class-validator";

export class ChangeUsersParamsDto {
    @IsString()
    name: string;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    oldPassword: string;

    @IsOptional()
    @IsString()
    newPassword: string;
}
