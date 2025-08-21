import type { Currency, Localisation, RegistrationType } from '../../../shared/api';

export type RegistrationConfig = {
  first_gift_id: string;
  second_gift_id: string;
};

export type CallCenterConfig = {
  webim: {
    key: string;
    enabled: boolean;
  };
  freshchat: {
    token: string;
    enabled: boolean;
  };
  livechat: {
    license: string;
    enabled: boolean;
  };
  tmLink: string | null;
  vbLink: string | null;
};

export type ValdemoroConfig = {
  enabled: boolean;
  src: string;
};

export type MetricsConfig = Record<string, Record<string, unknown> | null>;

export type CaptchaConfig = {
  site_key: string | null;
  enabled: boolean;
  enabled_register: boolean;
  enabled_login: boolean;
};

export type ServerData = Partial<{
  registrationConfig: RegistrationConfig;
  grouper: Record<string, unknown>;
  webim: Record<string, unknown>;
  callCenterConfig: CallCenterConfig;
  valdemoro: ValdemoroConfig;
  webPushKey: string;
  metrics: MetricsConfig;
  // @deprecated, now only the email registration type available. It doesn't impact anything in the app
  registrationTypes: RegistrationType;
  captcha: CaptchaConfig;
  promoTelegramChannelUrl: string;
  abTests: unknown[];
  isLoaded: boolean;
  currencies: Currency[];
  defaultCurrency: Currency;
  myCountries: Currency[];
  payoutInitLimit: number | null; // nullable just in case when we do NOT set any limits for payouts.
}>;

export type SeoMetaResource = {
  description?: string;
  isNoindexPath?: boolean;
  keywords?: string;
  metaCanonical?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaTitle?: string;
  title?: string;
};

export type StaticPageListItem = {
  hidden: boolean;
  id: string;
  slug: string;
  title: string;
  url: string;
};

export type StaticPageResource = Pick<StaticPageListItem, 'title' | 'slug' | 'id'> & {
  button_text_for_game_list: string | null;
  content: string;
  game_list_title: string | null;
  games: Array<{ id: string }>;
  localisation: Localisation;
  meta: SeoMetaResource;
};

export type StaticPagesItemResource = Partial<
  StaticPageListItem & {
    pageType: string;
  }
>;

export type PhoneCode = {
  code: string;
  dialCode: number;
  name: string;
  example: string;
  phone_mask?: null | string;
};

export type PhoneCodeList = {
  [countryCode: string]: PhoneCode;
};
