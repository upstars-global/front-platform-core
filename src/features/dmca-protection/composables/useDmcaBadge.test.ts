// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useDmcaBadge } from './useDmcaBadge';
import { useAppGlobalConfigStore } from '../../../entities/app-config';
import { useMultiLangStore } from '../../../entities/multilang';

const ACCOUNT_ID = 'b7fb5656-515a-46c6-b509-ca0df3b316b3';
const KEY = 'cWFONlZObnd4ZmxuS0lRZnQxc09jQT090';
const STATUS = `https://www.dmca.com/Protection/Status.aspx?ID=${ACCOUNT_ID}`;

describe('useDmcaBadge', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('is disabled and yields an empty href when there is no DMCA config', () => {
    const { isEnabled, dmcaKey, href } = useDmcaBadge();

    expect(isEnabled.value).toBe(false);
    expect(dmcaKey.value).toBeUndefined();
    expect(href.value).toBe('');
  });

  it('exposes the account id and per-domain key from config', () => {
    useAppGlobalConfigStore().setGlobalConfig({ dmcaProtection: { accountId: ACCOUNT_ID, key: KEY } });

    const { isEnabled, dmcaKey, accountId } = useDmcaBadge();

    expect(isEnabled.value).toBe(true);
    expect(dmcaKey.value).toBe(KEY);
    expect(accountId.value).toBe(ACCOUNT_ID);
  });

  it('builds the href with refurl from runtimeHostnameDuringSSR + path (bot runtime SSR)', () => {
    useAppGlobalConfigStore().setGlobalConfig({ dmcaProtection: { accountId: ACCOUNT_ID, key: KEY } });
    useMultiLangStore().setRuntimeHostnameDuringSSR('winspirit3.com');

    const { href } = useDmcaBadge({ currentPath: () => '/casino' });

    expect(href.value).toBe(`${STATUS}&refurl=https://winspirit3.com/casino`);
  });

  it('falls back to window.location host on the client (SPA, no runtime SSR host)', () => {
    useAppGlobalConfigStore().setGlobalConfig({ dmcaProtection: { accountId: ACCOUNT_ID, key: KEY } });

    const { href } = useDmcaBadge({ currentPath: () => '/promotions' });

    expect(href.value).toBe(`${STATUS}&refurl=https://${window.location.host}/promotions`);
  });

  it('defaults the path to "/" when no currentPath is provided', () => {
    useAppGlobalConfigStore().setGlobalConfig({ dmcaProtection: { accountId: ACCOUNT_ID, key: KEY } });
    useMultiLangStore().setRuntimeHostnameDuringSSR('winspirit3.com');

    const { href } = useDmcaBadge();

    expect(href.value).toBe(`${STATUS}&refurl=https://winspirit3.com/`);
  });
});
