import { Column, Entity, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet-history')
export class WalletHistoryEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'bigint' })
    credit: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'int' })
    userId: number;

    @Column({ type: 'varchar', unique: true })
    referenceId: string;
}
