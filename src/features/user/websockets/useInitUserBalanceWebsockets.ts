import { useWebsocketsBridge } from "../../../shared/libs/websockets";
import type { UserBalanceWebsockets } from "./types";
import { userBalanceWebsocketsEmitter } from "./userBalanceWebsocketsEmitter";

export enum UserBalanceWebsocketTypes {
  BALANCE_CHANGED = 'balance.changed',
  PAYOUT_CREATED = 'treasury.event.payout.created',
  TRANSACTION_CONFIRMED = 'treasury.event.transaction.confirmed',
  LOSS_LIMIT_REACHED = 'loss.limit.reached',
  BET_EXCEED = 'universal_gaming.bet.exceed',
}

export function useInitUserBalanceWebsockets() {
  useWebsocketsBridge<UserBalanceWebsockets>({
    emitter: userBalanceWebsocketsEmitter,
    websocketConfigMap: {
      [UserBalanceWebsocketTypes.BALANCE_CHANGED]: {
        event: UserBalanceWebsocketTypes.BALANCE_CHANGED,
        verifyTimestamp: true,
      },
      [UserBalanceWebsocketTypes.PAYOUT_CREATED]: {
        event: UserBalanceWebsocketTypes.PAYOUT_CREATED,
        verifyTimestamp: false,
      },
      [UserBalanceWebsocketTypes.TRANSACTION_CONFIRMED]: {
        event: UserBalanceWebsocketTypes.TRANSACTION_CONFIRMED,
        verifyTimestamp: false,
      },
      [UserBalanceWebsocketTypes.LOSS_LIMIT_REACHED]: {
        event: UserBalanceWebsocketTypes.LOSS_LIMIT_REACHED,
        verifyTimestamp: false,
      },
      [UserBalanceWebsocketTypes.BET_EXCEED]: {
        event: UserBalanceWebsocketTypes.BET_EXCEED,
        verifyTimestamp: false,
      },
    },
  });
}
