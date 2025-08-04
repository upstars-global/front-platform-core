export enum BrowserList {
  chrome = 'Chrome',
  safari = 'Safari',
  safariMobile = 'Mobile Safari',
}

export interface IClientContextResource {
  userAgent?: string;
  isMetaWebview?: boolean;
  isIOS?: boolean;
  isMobile: boolean;
  isApp?: boolean;
  isMacOS?: boolean;
  browser?: BrowserList;
  isBot?: boolean;
}
