import * as Sentry from '@sentry/vue';
import type { ComputedRef } from 'vue';
import type { Pinia } from 'pinia';
import { UserVipStatus } from '../../../entities/user';

export type VueRouter = Required<Parameters<typeof Sentry.browserTracingIntegration>>[0]['router'];
export type VueApp = Required<Parameters<typeof Sentry.init>>[0]['app'];

export interface SentrySetupConfig {
  app: VueApp;
  router: VueRouter;
  pinia: Pinia;
  dsn: string;
  releasePrefix: string;
  tracePropagationTargets: (string | RegExp)[];
  enabled?: boolean;
  normalizeDepth?: number;
  tracesSampleRate?: number;
}

export interface SentrySetupOptions {
  vipStatusName?: ComputedRef<'' | UserVipStatus>;
}
