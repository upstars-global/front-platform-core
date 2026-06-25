// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { useDmcaBadge } from './useDmcaBadge';
import { useAppGlobalConfigStore } from '../../../entities/app-config';

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

  it('builds the badge href from the account id, exposes the per-domain key (no refurl before mount / during SSR)', () => {
    useAppGlobalConfigStore().setGlobalConfig({ dmcaProtection: { accountId: ACCOUNT_ID, key: KEY } });

    const { isEnabled, dmcaKey, accountId, href } = useDmcaBadge();

    expect(isEnabled.value).toBe(true);
    expect(dmcaKey.value).toBe(KEY);
    expect(accountId.value).toBe(ACCOUNT_ID);
    expect(href.value).toBe(STATUS);
  });

  it('appends refurl (current page url) on mount, replicating DMCABadgeHelper.min.js', async () => {
    useAppGlobalConfigStore().setGlobalConfig({ dmcaProtection: { accountId: ACCOUNT_ID, key: KEY } });

    let api: ReturnType<typeof useDmcaBadge> | undefined;
    const Comp = defineComponent({
      setup() {
        api = useDmcaBadge();

        return () => h('a', { class: 'dmca-badge', href: api?.href.value });
      },
    });

    mount(Comp);
    await nextTick();

    expect(api?.href.value).toBe(`${STATUS}&refurl=${document.location.href}`);
  });
});
