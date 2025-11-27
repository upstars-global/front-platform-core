export enum TransactionType {
  DEPOSIT = "deposit",
  PAYOUT = "payout",
}

export type TransactionHistoryItemResource = {
  cancelReason: unknown;
  createdAt: number;
  currency: string;
  customerPurse: string;
  feeMessage: string;
  id: string;
  paymentSystem: string;
  status: string;
  statusText: string;
  sum: number;
  sumWithFees: number;
  type: TransactionType;
  updatedAt: number;
}

export type BetResource = {
  amount: number;
  currency: string;
  date: number;
}

export type PaymentMethodResourceLimit = {
  currency: string;
  min: number;
  max: number;
}

export type PaymentMethodResource = {
  id: string;
  fee: number;
  icons: {
      name: string;
      url: string;
  }[];
  isLocked: boolean;
  kycVerificationRequired: boolean;
  limits: PaymentMethodResourceLimit[],
  name: string;
  originalRouteName: string;
  routeName: string;
  tags: string[];
  treasuryOrderingPosition: number;
}

export type LoadPaymentMethodsResource = {
  data: PaymentMethodResource[];
  meta: {
      depositManagerEnabled: boolean;
  };
}

export type InitDepositResource = {
  operationId?: string;
  paymentSystemOperationId?: string;
  redirectUrl?: string;
  fraud?: boolean;
  message?: string;
  staticClass?: string;
}

export type InitPayoutResource = {
  redirectUrl: string;
  fraud?: boolean;
  message?: string;
  staticClass?: string;
  verification: {
      status: string;
      verificationStatus: string;
  };
}

export type PayoutLimitResource = {
  payoutInitRemaining: number | null,
  allowedPayoutAmount: number | null,
  limitRefreshDateAt: string
}

export type PayoutItemResource = {
  amount: number;
  currency: string;
  customer_purse: string;
  date: number;
  id: string;
  payment_system: string;
  reserved_amount: number;
}

export type TransactionTreasuryConfirmedMessage = {
  base_amount: string;
  base_currency: string;
  id: string;
  timestamp: number;
  to: string;
  type: string;
}

export type SumRangeResource = {
  amount: number;
  currency: string;
}

export type GeneralLimitResource = {
  currency: string;
  default: number;
  max: number;
  min: number;
}

export type CurrencyRatesResource = {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export type BetExceedData = {
  max_bet: string;
  currency: string;
}

export type WithdrawalDefaultAmountResource = {
  amount: number;
  currency: string;
}