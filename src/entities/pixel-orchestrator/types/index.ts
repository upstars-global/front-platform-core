import { Currency } from '../../../shared';

export type BaseDepositParams = {
  userId: string;
  transactionId: string;
  currency: Currency;
  amount: number;
};
