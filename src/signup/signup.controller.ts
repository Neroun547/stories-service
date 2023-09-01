import {Body, Controller, Post} from "@nestjs/common";
import {SignupDto} from "./dto/signup.dto";
import {SignupService} from "./service/signup.service";

@Controller()
export class SignupController {
    constructor(private signupService: SignupService) {}

    @Post()
    async signup(@Body() body: SignupDto) {
        await this.signupService.signup(body);

        return;
    }
}
