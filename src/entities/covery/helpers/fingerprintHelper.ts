import { deviceFingerprint } from '../covery';

export function fingerprintHelper<T extends Record<string, unknown>>(
  data: T
): T & { dfpc: string } & Record<string, unknown> {
    return {
    ...data,
    dfpc: deviceFingerprint()
  };
}
