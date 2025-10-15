import type { PAYMENT_METHOD } from "../../../entities/cashbox/config";

export type IsTargetPaymentProcessorParams = {
  targetId: PAYMENT_METHOD,
  processorId?: string | null,
}

export function isTargetPaymentProcessor(params: IsTargetPaymentProcessorParams): boolean {
  const { processorId, targetId } = params;
  if (!processorId) {
      return false;
  }
  return processorId === targetId;
}