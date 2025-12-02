import type { StatusProgressionsDynamic, StatusProgressionsStatic } from '../api';

export enum StatusProgressionsWebsocketType {
  STATIC_UPDATE = 'progression.static.updated',
  DYNAMIC_UPDATE = 'progression.dynamic.updated',
}

export enum AuthWebsocketType {
  SESSION_INVALIDATED = "users.session.invalidate"
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

export type AuthSessionInvalidateWebsocket = {
  type: AuthWebsocketType.SESSION_INVALIDATED,
  timestamp: number;
};

export type UserWebsocketsEvents = {
  [StatusProgressionsWebsocketType.STATIC_UPDATE]: StatusProgressionsStaticWebsocket;
  [StatusProgressionsWebsocketType.DYNAMIC_UPDATE]: StatusProgressionsDynamicWebsocket;
  [AuthWebsocketType.SESSION_INVALIDATED]: AuthSessionInvalidateWebsocket;
};
