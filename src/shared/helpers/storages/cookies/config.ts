export type CookieConfig = {
  expires?: () => number; // seconds
  path?: string;
  readonly?: boolean;
};

export type CookieName = string;

export type CookieConfigMap<T extends CookieName> = Record<T, CookieConfig>;
