import type { BaseDepositParams } from '../../../entities/pixel-orchestrator';

export enum PixelGeoCountry {
  All = 'ALL',
  CANADA = 'CA',
  AUSTRALIA = 'AU',
}

export enum PixelType {
  VISITORS = 'visitors',
  REGISTRATION = 'registration',
  FIRST_TIME_DEPOSIT = 'ftd',
  DEPOSIT = 'deposit',
}

type PixelRuntimeDepositParams = {
  type: PixelType.DEPOSIT | PixelType.FIRST_TIME_DEPOSIT;
} & BaseDepositParams;

export type LogRegistrationViaPixelAnalyticParams = {
  userId: string;
};
export type PixelRuntimeParams =
  | { type: PixelType.VISITORS }
  | ({ type: PixelType.REGISTRATION } & LogRegistrationViaPixelAnalyticParams)
  | PixelRuntimeDepositParams;

export interface PixelStaticConfig<T> {
  enabledGeos: PixelGeoCountry[];
  query?: T;
}

export type PixelConfigMap<T = unknown> = Record<PixelType, PixelStaticConfig<T>>;

export interface PixelEnvironment {
  geoCountry: string;
}
