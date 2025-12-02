import type { BalanceChangedData } from '../../../entities/user';
import type { BetExceedData, PayoutItemResource, TransactionTreasuryConfirmedMessage } from "../../../entities/cashbox";
import type { UserBalanceWebsocketTypes } from "./useInitUserBalanceWebsockets";

export type UserBalanceWebsockets = {
  [UserBalanceWebsocketTypes.BALANCE_CHANGED]: BalanceChangedData;
  [UserBalanceWebsocketTypes.PAYOUT_CREATED]: PayoutItemResource;
  [UserBalanceWebsocketTypes.TRANSACTION_CONFIRMED]: TransactionTreasuryConfirmedMessage;
  [UserBalanceWebsocketTypes.LOSS_LIMIT_REACHED]: Record<string, never>
  [UserBalanceWebsocketTypes.BET_EXCEED]: BetExceedData
};
