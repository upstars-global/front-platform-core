import type { BalanceChangedData } from "../../../entities/user/api";
import type { BetExceedData, PayoutItemResource } from "../../../entities/cashbox";
import type { UserBalanceWebsocketTypes } from "./useInitUserBalanceWebsockets";

export type UserBalanceWebsockets = {
  [UserBalanceWebsocketTypes.BALANCE_CHANGED]: BalanceChangedData;
  [UserBalanceWebsocketTypes.PAYOUT_CREATED]: PayoutItemResource;
  [UserBalanceWebsocketTypes.TRANSACTION_CONFIRMED]: undefined;
  [UserBalanceWebsocketTypes.LOSS_LIMIT_REACHED]: Record<string, never>
  [UserBalanceWebsocketTypes.BET_EXCEED]: BetExceedData
};
