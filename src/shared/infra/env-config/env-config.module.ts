import { DynamicModule, Module } from "@nestjs/common";
import { join } from "node:path";
import { ConfigModule, ConfigModuleOptions } from "@nestjs/config";
import { EnvConfigService } from "./env-config.service";

@Module({
    providers: [EnvConfigService],
})
export class EnvConfigModule {
    static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
        return {
            module: EnvConfigModule,
            imports: [
                ConfigModule.forRoot({
                    ...options,
                    isGlobal: true,
                    envFilePath: [
                        join(
                            __dirname,
                            `../../../../.env.${process.env.NODE_ENV}`,
                        ),
                    ],
                }),
            ],
        };
    }
}
