export enum DIErrorCode {
  BALANCE_LIMIT = 'BALANCE_LIMIT',
  DI_LIMIT = 'DI_LIMIT',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  DEPOSITS_NOT_FOUND = 'DEPOSITS_NOT_FOUND',
  KYC_NOT_VERIFIED = 'KYC_NOT_VERIFIED',
  DI_DISABLED = 'DI_DISABLED',
  PAYOUT_EXISTS = 'PAYOUT_EXISTS',
}

export interface DIInfoResource {
  isEnabled: boolean;
  userActivationsLimit: number;
  todayActivationsLeft: number;
  todayInsuredSum: number;
  userDepositPercent: number;
  userMinBalance: number;
  lastInsuranceDatetime: string | null;
  giftWinLimit: number;
  giftWager: number;
}

export interface DICreateSuccessResource {
  id: string;
}

export interface DIValidationError {
  field: string;
  code: DIErrorCode;
  template: string;
  params: unknown[];
}

export interface DICreateErrorResource {
  type: 'VALIDATION';
  description: 'Validation error';
  validationErrors: DIValidationError[];
}
