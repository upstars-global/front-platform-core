import type { CookieConfig, CookieName } from '../helpers/storages/cookies/config';

let cookieNames: Record<CookieName, string> = {};

export function setCookieNames(names: Record<CookieName, string>) {
  cookieNames = { ...cookieNames, ...names };
}

export function getCookieNames() {
  return cookieNames;
}

let cookieConfigMap: Record<CookieName, CookieConfig> = {};

export function setCookieConfigMap(names: Record<CookieName, CookieConfig>) {
  cookieConfigMap = { ...cookieConfigMap, ...names };
}

export function getCookieConfigMap() {
  return cookieConfigMap;
}

export const cookieConfig = {
  setCookieNames,
  setCookieConfigMap,
  getCookieNames,
  getCookieConfigMap,
};
