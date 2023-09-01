import { IsString } from "class-validator";

export class AuthDto {
    @IsString()
    usernameOrEmail: string;

    @IsString()
    password: string;
}
