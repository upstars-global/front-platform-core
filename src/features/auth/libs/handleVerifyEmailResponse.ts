import type { IVerifyEmailResource } from "../../../entities/auth";
import { IBIZA_KEYS_FALSY_RESPONSE } from "../config";

export enum VerifyEmailStatus {
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export type HandleVerifyEmailResponseResult = { status: VerifyEmailStatus; invalidCode?: IVerifyEmailResource['result'] };

export function handleVerifyEmailResponse(response: IVerifyEmailResource): HandleVerifyEmailResponseResult {
  let isValid = false;

  isValid = !IBIZA_KEYS_FALSY_RESPONSE[response.result];

  if (!isValid) {
    return { status: VerifyEmailStatus.INVALID, invalidCode: response.result };
  }

  return { status: VerifyEmailStatus.VALID };
}