
export enum VipSettingWebsocketType {
  SEASON_CHANGED = 'vip.active_season_changed',
}

export type VipSettingWebsocket = {
  type: VipSettingWebsocketType.SEASON_CHANGED;
  timestamp: number;
  data: '';
};


export type VipSettingWebsocketsEvents = {
  [VipSettingWebsocketType.SEASON_CHANGED]: VipSettingWebsocket;
};
