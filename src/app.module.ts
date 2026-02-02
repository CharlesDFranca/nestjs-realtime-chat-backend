import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EnvConfigModule } from "./shared/infra/env-config/env-config.module";
import { UsersModule } from './users/users.module';

@Module({
    imports: [EnvConfigModule.forRoot(), UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
