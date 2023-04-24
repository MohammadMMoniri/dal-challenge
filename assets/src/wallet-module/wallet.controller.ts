import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { WalletService } from './wallet.service';
import { AddMoneyDto } from './dtos';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Get('get-balance/:userId')
    async getBalance(@Param('userId') userId: number) {
        return this.walletService.getBalance(userId);
    }

    @Post('add-money')
    async addMoney(@Body() addMoneyData: AddMoneyDto) {
        return this.walletService.addMoney(addMoneyData);
    }
}
