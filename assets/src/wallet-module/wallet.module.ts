import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletEntity, WalletHistoryEntity } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { MessageConsumer } from './wallet.consumer';

@Module({
    imports: [
        TypeOrmModule.forFeature([WalletEntity, WalletHistoryEntity]),
        BullModule.registerQueue({
            name: 'wallet-queue',
        }),
    ],
    controllers: [WalletController],
    providers: [WalletService, MessageConsumer],
})
export class WalletModule {}
