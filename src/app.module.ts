import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Users} from "../db/users/users.entity";
import {RouterModule} from "@nestjs/core";
import {SignupModule} from "./signup/signup.module";
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./users/users.module";
import {StoriesModule} from "./stories/stories.module";
import {Stories} from "../db/stories/stories.entity";
import { Subscribes } from "../db/subscribes/subscribes.entity";
import {SettingsModule} from "./settings/settings.module";
import {Settings} from "../db/settings/settings.entity";

@Module({
  imports: [
      ConfigModule.forRoot(),
      MikroOrmModule.forRoot({
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        type: "mysql",
        entities: [Users, Stories, Subscribes, Settings],
        forceUtcTimezone: true
      }),
      SignupModule,
      AuthModule,
      UsersModule,
      StoriesModule,
      SettingsModule,
      RouterModule.register([
          { path: "api/signup", module: SignupModule },
          { path: "api/auth", module: AuthModule },
          { path: "api/users", module: UsersModule },
          { path: "api/stories", module: StoriesModule },
          { path: "api/settings", module: SettingsModule }
      ])
  ],
  providers: [],
})
export class AppModule {}
