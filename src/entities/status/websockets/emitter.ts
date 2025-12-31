import mitt from 'mitt';
import type { VipSettingWebsocketsEvents } from './types';

export const statusVipSettingWebsocketsEvents = mitt<VipSettingWebsocketsEvents>();
