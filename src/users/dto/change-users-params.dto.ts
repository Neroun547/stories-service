import {IsEmail, IsOptional, IsString, Length} from "class-validator";

export class ChangeUsersParamsDto {
    @IsString()
    @Length(1, 30, { message: "system.ui.translate.error.name.length" })
    name: string;

    @IsString()
    @Length(1, 30, { message: "system.ui.translate.error.username.length" })
    username: string;

    @IsEmail()
    @Length(1, 255, { message: "system.ui.translate.error.email.length" })
    email: string;

    @IsOptional()
    @IsString()
    oldPassword: string;

    @IsOptional()
    @IsString()
    @Length(6, 30, { message: "system.ui.translate.error.password.length" })
    newPassword: string;
}
