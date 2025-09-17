import type { StatusProgressionsDynamic, StatusProgressionsStatic } from '../api';

export enum StatusProgressionsWebsocketType {
  STATIC_UPDATE = 'progression.static.updated',
  DYNAMIC_UPDATE = 'progression.dynamic.updated',
}

export type StatusProgressionsStaticWebsocket = {
  type: StatusProgressionsWebsocketType.STATIC_UPDATE,
  timestamp: number;
  data: StatusProgressionsStatic;
};

export type StatusProgressionsDynamicWebsocket = {
  type: StatusProgressionsWebsocketType.DYNAMIC_UPDATE,
  timestamp: number;
  data: StatusProgressionsDynamic;
};

export type UserWebsocketsEvents = {
  [StatusProgressionsWebsocketType.STATIC_UPDATE]: StatusProgressionsStaticWebsocket;
  [StatusProgressionsWebsocketType.DYNAMIC_UPDATE]: StatusProgressionsDynamicWebsocket;
};
