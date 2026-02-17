import type { RegisterErrorResource } from '../../../entities/auth';

export function isRegisterErrorResource(value: unknown): value is RegisterErrorResource {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return Boolean((value as RegisterErrorResource)?.message);
}