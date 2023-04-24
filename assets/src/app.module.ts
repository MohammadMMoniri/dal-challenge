import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import configuration from './config/configuration';
import { WalletModule } from './wallet-module/wallet.module';
import { WalletEntity, WalletHistoryEntity } from './wallet-module/entities';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('database.host'),
                port: +configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.database'),
                entities: [WalletEntity, WalletHistoryEntity],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: {
                    host: configService.get('redis.host'),
                    port: +configService.get('redis.port'),
                },
            }),
            inject: [ConfigService],
        }),
        WalletModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
