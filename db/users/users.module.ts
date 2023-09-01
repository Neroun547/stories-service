import { MikroOrmModule } from "@mikro-orm/nestjs";
import {Module} from "@nestjs/common";
import {Users} from "./users.entity";
import {UsersServiceDb} from "./users.service";

@Module({
    imports: [MikroOrmModule.forFeature([Users])],
    providers: [UsersServiceDb],
    exports: [UsersServiceDb]
})
export class UsersModuleDb {}
