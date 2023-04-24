import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';

import { AddMoneyDto } from './dtos';
import { WalletEntity, WalletHistoryEntity } from './entities';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(WalletEntity)
        private walletRepository: Repository<WalletEntity>,
        @InjectRepository(WalletHistoryEntity)
        private walletHistoryRepository: Repository<WalletHistoryEntity>,
        @InjectQueue('wallet-queue') private queue: Queue,
        private dataSource: DataSource,
    ) {}

    async getBalance(userId: number) {
        const userWallet = await this.walletRepository.findOne({
            where: {
                userId,
            },
        });
        if (!userWallet) {
            throw new NotFoundException('there is no wallet for this userId.');
        }
        return { balance: userWallet.balance };
    }

    async addMoney(addMoneyData: AddMoneyDto) {
        const referenceId = uuidv4();
        await this.queue.add(
            'addMoney-job',
            {
                referenceId,
                userId: addMoneyData.user_id,
                amount: addMoneyData.amount,
            },
            {
                attempts: 5,
                backoff: 5000,
            },
        );
        return { reference_id: referenceId };
    }

    async createHistoryAndAddMoney({ userId, amount, referenceId }) {
        try {
            const walletHistory = this.walletHistoryRepository.create({
                userId,
                credit: amount,
                referenceId,
            });

            const wallet = await this.walletRepository.findOne({
                where: { userId },
            });
            await this.dataSource.transaction(async (manager) => {
                wallet
                    ? await manager.update(
                        WalletEntity,
                        { userId },
                        { balance: () => `balance + ${amount}` },
                    )
                    : await manager.save(
                        this.walletRepository.create({
                            userId,
                            balance: amount,
                        }),
                    );
                await manager.save(walletHistory);
            });
        } catch (error) {
            throw error;
        }
    }
}
