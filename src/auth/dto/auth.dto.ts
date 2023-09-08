import {IsString, Length} from "class-validator";

export class AuthDto {
    @IsString()
    @Length(1, 255, { message: "system.ui.translate.error.username_or_email.length" })
    usernameOrEmail: string;

    @IsString()
    @Length(6, 30, { message: "system.ui.translate.error.password.length" })
    password: string;
}
