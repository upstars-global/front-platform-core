import { Currency, Gender, type Localisation, RegistrationType, type TimestampSocketData } from '../../../shared/api';


export enum VerificationsStatusOld {
  INITIAL = 'initial',
  VERIFIED = 'verified',
  APPROVED = 'approved',
  PENDING = 'pending',
}

export enum VerificationsStatus {
  INITIAL = 'initial',
  REJECTED = 'rejected',
  RECHECK = 'recheck',
  APPROVED = 'approved',
  PENDING = 'pending',
  IN_PROGRESS = 'in progress',
}

export type VerificationPaymentMethod = {
  cardNumber: string;
  expiryDate: string;
  icon: string;
  id: string;
  isVerified: boolean;
  methodName: string;
  verificationStatus: VerificationsStatus;
};

export type VipManagerResource = {
  id: string;
  publicName: string;
  privateName: string;
  email: string;
  whatsapp: string;
  telegram: string;
  profilePicture: string;
  phoneNumbers: string;
  gender: Gender;
  dateStart: {
    date: string;
    weekday: number;
  };
  dateEnd: {
    date: string;
    weekday: number;
  };
};

export enum SelfExclusionStatus {
  COOLING_OFF_INIT = 'cooling_off_init',
  COOLING_OFF_ACTIVE = 'cooling_off_active',
  SELF_EXCLUSION_WAITING = 'self_exclusion_waiting',
}

// profile data

export type UserProfileResource = {
  id: string;
  user_id: string;

  // personal info
  nick_name: string | null;
  lastname: string | null;
  firstname: string | null;
  middlename: string | null;
  gender: string | null;

  // contact info
  emails: Array<{
    email: string;
    is_primary: boolean;
    is_verified: boolean;
  }>;
  phones: Array<{
    phone: string;
    is_primary: boolean;
    is_verified: boolean;
  }>;

  // address info
  address: string | null;
  country: string | null;
  birthday: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;

  birthday_verified: boolean;
  hash: string;
  registration_contact_type: string;
  multi_account: boolean;
  support_manager_id: string | null;
  status: number;
  currency?: Currency;
  localization: string;
  verification: {
    isAntiFraudVerified: boolean;
    isVerified: boolean;
    status: VerificationsStatusOld;
    verificationStatus: VerificationsStatus;
    isFullVerificationPassed?: boolean;
    paymentMethods?: VerificationPaymentMethod[];
  };
  chosen_country: string;
  user_type: string;
  vipManager: VipManagerResource | null;
  selfExclusionStatus: SelfExclusionStatus | null;
  isSuspended?: boolean | null;
};

export type ICreateContactResource = {
  expired: null;
  isMaxAttemptUsed: null;
  status: string;
  title: string;
  type: RegistrationType;
  value: string;
  waitTime: null;
};

export type IUpdateUserProfileDTO = {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  middlename?: string;
  birthday?: string;
  region?: string;
  city?: string;
  state?: string;
  street?: string;
  zip?: string;
  dfpc?: string;
  localization?: string;
};

export type IUserUpdateProfileResource = {
  success: boolean;
  errors?: Record<string, string[]>;
};

// password

export type IUserRestorePasswordResource = {
  is_max_attempts_used: boolean;
  success: boolean;
  errors: string[] | Record<string, string[]>;
};

export type IUserRestorePasswordDTO = {
  code?: string;
  password: string;
};

// verification

export type IUserContactsOnVerificationResource = {
  value: string;
  type: RegistrationType;
  title: string;
  expired: string;
};

// notifications

export enum NotificationStatus {
  NEW = 'new',
  READ = 'read',
}

export type IUserNotificationVarsResource = Record<string, unknown> & {
  phaseId?: string;
  phaseName?: string;
  phaseNames?: Record<string, string>;
};

export interface IUserNotificationResource {
  button: {
    link: string;
    name: string;
  };
  code: string;
  created_at: number;
  expired_at: number;
  id: string;
  img_url: string;
  key: string;
  localisation?: Localisation;
  msg: string;
  parent: string | null;
  restricted_countries: string[];
  status: NotificationStatus;
  updated_at: number;
  vars?: IUserNotificationVarsResource;
}

// consents

export type UserConsent = {
  optedIn: boolean;
  type: string;
};

export type IUserConsentsResource = {
  consents: UserConsent[];
  info?: {
    email?: string;
  };
};

export type UserConsentDTO = UserConsent;

// balance

export type IUserBalanceBonusesWagering = {
  userGiftId: string;
  sum: number;
  sumWagering: number;
};

export type ISportBonus = {
  sumWagering: number;
  totalWagering: number;
  sum: number;
};

export type IUserBalanceResource = {
  user_id: string;
  balance: number;
  currency: Currency;
  is_active_bonus: boolean;
  bonus: number;
  wagering: number;
  totalWagering: number;
  bonuses: {
    sport: ISportBonus | null;
    freeBet: { sum: number } | null;
  };
  bonusesWagering?: {
    sport: IUserBalanceBonusesWagering | null;
    casino: IUserBalanceBonusesWagering | null;
  };
};

// other

export enum profileType {
  SIMPLE = 'type.profile.simple',
  HARD = 'type.profile.hard',
  BRAZIL = 'type.profile.brazil',
}

export enum treasuryType {
  SIMPLE = 'type.treasury.simple',
  HARD = 'type.treasury.hard',
}

export type IUserFeatureResource = {
  feature: string;
  isAvailable: boolean;
};

export type IUserBettingTokenResource = {
  clientId: number;
  isNew: boolean;
  token: string;
};

export type IUserWinbackDataResource = {
  multiplier: number;
  winback: number;
  winbackStatus: boolean;
};

export enum VerificationTypes {
  IDENTITY = 'identity',
  PAYMENT_METHOD = 'paymentMethod',
}

export type IUserKYCData = {
  token: string;
};

export type IUserStrategiesResource = Record<
  string,
  {
    type: string;
  }
>;

export type IUserCallbackDataDTO = {
  name: string;
  phoneNumber: string;
  message: string;
};

export type IUserCallbackDataResource = {
  callbackStatus?: 'rate-limited' | 'queued';
  sentDatetime: string;
};

export type IUserFastTrackSIDResource = {
  sid: string;
};

// statuses

export enum UserStatusResource {
  NO_SET = 0,
  NEW = 10,
  ACE = 20,
  ACE2 = 30,
  ACE3 = 40,
  EXVIP = 50,
  STAR = 60,
  BRONZE = 70,
  SILVER = 80,
  GOLD = 90,
  PLATINUM = 100,
  DIAMOND = 110,
}

export enum UserVipStatus {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

export const USER_REGULAR_STATUS = 'REGULAR' as const;

export type IUserStatusResource = {
  userId: string | null;
  currency: Currency;
  currentStatus: keyof typeof UserStatusResource;
  currentStatusInt: UserStatusResource;
  nextStatus: UserVipStatus;
  nextStatusInt: UserStatusResource;
  activeStatus: UserVipStatus | typeof USER_REGULAR_STATUS;
  depositAmountCents: number;
  depositThresholdCents: number;
  betSumCents: number;
  betSumThresholdCents: number;
  overallProgress: number;
};

export type BalanceChangedDataChange = {
    real: number;
    bonus: number;
    wagering: number;
    sportBonus: number;
    sportWagering: number;
    freeBetBonus: number;
}
export type BalanceChangedDataBonusWagering = {
    userGiftId: string;
    sum: number;
    sumWagering: number;
}
export type BalanceChangedData = TimestampSocketData & {
    type: "balance.changed";
    balanceType?: "real" | string;
    balance: number;
    reason: string;
    changes?: BalanceChangedDataChange[];
    bonus?: number;
    sumWagering?: number;
    totalWagering?: number;
    bonusesWagering?: {
        sport?: BalanceChangedDataBonusWagering | null;
        casino?: BalanceChangedDataBonusWagering | null;
    };
    bonuses: {
        sport: ISportBonus | null;
        freeBet: { sum: number; } | null;
    };
};

export type IUserRefcodeResource = {
  isLoaded: boolean;
  types: string[];
};
