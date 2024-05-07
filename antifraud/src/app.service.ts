import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionFull } from './entities/transaction.entity';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('ANTI_FRAUD_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  handleTransactionCreated(transaction: TransactionFull) {
    if (transaction.value > 1000) {
      const rejectedTransaction = {
        ...(transaction as TransactionFull),
        status: 'rejected',
      };

      this.kafkaClient.emit(
        'transaction_checked',
        JSON.stringify(rejectedTransaction),
      );
    } else {
      const approvedTransaction = {
        ...transaction,
        status: 'approved',
      };

      this.kafkaClient.emit(
        'transaction_checked',
        JSON.stringify(approvedTransaction),
      );
    }
  }
}
