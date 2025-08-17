export type LicenceDomainConfig = {
  licenceId: string;
  licenceScriptId: string;
  licenceScriptSrc: string;
};

type FreshChatConfig = {
  host: string;
  token: string;
  scriptUrl: string;
  widgetUuid: string;
  widgetUuidVip: string;
};

type TrustpilotConfig = {
  templateId: string;
  businessUnitId: string;
  widgetUrl: string;
  scriptSrc: string;
};

type FooterSpecificCompliance = {
  show: boolean;
  companyName: string;
};

export type AppGlobalConfig = {
  isLockAuthForGuestUser?: boolean;
  mirrorDomain?: string;
  supportEmail?: string;
  socialLinksDisabled?: boolean;
  bettingDomain: string;
  licenceDomainConfig: LicenceDomainConfig | null;
  footerSpecificCompliance: FooterSpecificCompliance | null;
  gcbCertificationToken?: string | null;
  freshChatConfig?: FreshChatConfig;
  trustpilotConfig: TrustpilotConfig | null; // null if just logo should exist
  showRegistrationPromoCode: boolean;
};

export type ReelsVersion = {
  version: string;
};

export type HreflangListConfig = {
  hreflangList: Record<string, string>;
};
