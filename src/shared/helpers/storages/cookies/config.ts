export type CookieConfig = {
  expires?: () => number; // seconds
  path?: string;
  readonly?: boolean;
};

export type CookieConfigMap<T extends string> = Record<T, CookieConfig>;
