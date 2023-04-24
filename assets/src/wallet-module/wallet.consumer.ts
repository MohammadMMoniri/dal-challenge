import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { WalletService } from './wallet.service';

@Processor('wallet-queue')
export class MessageConsumer {
    constructor(private readonly walletService: WalletService) {}
    @Process('addMoney-job')
    async readOperationJob(
        job: Job<{ userId: number; amount: number; referenceId: string }>,
    ) {
        try {
            await this.walletService.createHistoryAndAddMoney(job.data);
        } catch (error) {
            throw error;
        }
    }
}
