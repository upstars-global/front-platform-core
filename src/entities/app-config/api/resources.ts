import type { BrowserList } from '../../../shared/types';
import type { FirebaseOptions } from 'firebase/app';

export interface IFastTrackConfigResource {
  scriptSrc: string;
  firebaseConfig: FirebaseOptions;
  firebaseVapidKey?: string;
}

export interface IDigitainConfigResource {
  sportPartner: string;
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

export type TopLeadersCategory = 'live' | 'casino' | 'sport';

export interface ITopLeaderDataResource {
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
}

export interface ITopLeaderCategoryResource {
  day: ITopLeaderDataResource[];
  month: ITopLeaderDataResource[];
}

export interface ITopLeaders {
  [key: string]: ITopLeaderCategoryResource;
}

export interface ILivespinsDataResource {
  tenant: string;
  serverConfig: {
    api: string;
    ui?: string;
  };
}
