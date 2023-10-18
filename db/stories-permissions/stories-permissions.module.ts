import { MikroOrmModule } from "@mikro-orm/nestjs";
import {Module} from "@nestjs/common";
import {StoriesPermissions} from "./stories-permissions.entity";
import {StoriesPermissionsServiceDb} from "./stories-permissions.service";

@Module({
    imports: [MikroOrmModule.forFeature([StoriesPermissions])],
    providers: [StoriesPermissionsServiceDb],
    exports: [StoriesPermissionsServiceDb]
})
export class StoriesPermissionsModuleDb {}
