import type { BrowserList } from '../../../shared/types';
import type { FirebaseOptions } from 'firebase/app';

export type FastTrackConfigResource = {
  scriptSrc: string;
  firebaseConfig: FirebaseOptions;
  firebaseVapidKey?: string;
};

export type DigitainConfigResource = {
  sportPartner: string;
};

export type ClientContextResource = {
  userAgent?: string;
  isMetaWebview?: boolean;
  isIOS?: boolean;
  isMobile: boolean;
  isApp?: boolean;
  isMacOS?: boolean;
  browser?: BrowserList;
  isBot?: boolean;
};

export type TopLeadersCategory = 'live' | 'casino' | 'sport';

export type TopLeaderDataResource = {
  key?: string;
  id: string;
  login: string;
  win_amount: number;
  currency: string;
  game: {
    slug: string;
    name: string;
    image: string;
  };
};

export type TopLeaderCategoryResource = {
  day: TopLeaderDataResource[];
  month: TopLeaderDataResource[];
};

export type TopLeaders = {
  [key: string]: TopLeaderCategoryResource;
};

export interface LivespinsDataResource {
  tenant: string;
  serverConfig: {
    api: string;
    ui?: string;
  };
}
