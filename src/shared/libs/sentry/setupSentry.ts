import { watch } from 'vue';
import * as Sentry from '@sentry/vue';
import type { SentrySetupConfig, SentrySetupOptions } from './types';
import { USER_REGULAR_STATUS } from '../../../entities/user';
import { useEnvironmentStore } from '../../../entities/environment';
import { beforeSendFilter } from './beforeSendEventsFilter';

export function setupSentry(config: SentrySetupConfig, options?: SentrySetupOptions) {
  const {
    app,
    router,
    pinia,
    dsn,
    releasePrefix,
    tracePropagationTargets,
    enabled = true,
    normalizeDepth = 6,
    tracesSampleRate = 0.1
  } = config;

  const { isMockerMode, environment, version } = useEnvironmentStore(pinia);

  Sentry.init({
    app,
    enabled: enabled && !isMockerMode,
    dsn,
    environment,
    release: `${releasePrefix}@${version}`,
    normalizeDepth,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.captureConsoleIntegration({ levels: ['error'] }),
    ],
    tracePropagationTargets,
    tracesSampleRate,
    beforeSend: beforeSendFilter,
  });

  if (options?.vipStatusName) {
    watch(options.vipStatusName, () => {
      Sentry.setTag('user_vip_status', options.vipStatusName!.value || USER_REGULAR_STATUS);
      Sentry.setTag('user_is_vip', String(Boolean(options.vipStatusName!.value)));
    });
  }
}
