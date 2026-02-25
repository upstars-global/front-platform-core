import type { BaseDepositParams } from '../types';

export enum PixelOrchestratorEventsEnum {
  VISIT = 'visit',
  REGISTRATION = 'registration',
  FIRST_DEPOSIT = 'firstDeposit',
  DEPOSIT = 'deposit',
}

export type PixelOrchestratorEvents = {
  [PixelOrchestratorEventsEnum.VISIT]: void;
  [PixelOrchestratorEventsEnum.REGISTRATION]: string;
  [PixelOrchestratorEventsEnum.FIRST_DEPOSIT]: BaseDepositParams;
  [PixelOrchestratorEventsEnum.DEPOSIT]: BaseDepositParams;
};
