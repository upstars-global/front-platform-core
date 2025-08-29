import { type UserProfileResource, VerificationsStatus, VerificationsStatusOld } from '../api';
import { configI18nConfig } from '../../../shared/multilang/config/config';

// @REFACTOR we must rewrite it to not use mock data for non-authorized user (use null or undefined instead)
export function generateInitialProfileData(): UserProfileResource {
  return {
    id: '',
    user_id: '',
    lastname: null,
    firstname: null,
    middlename: null,
    address: null,
    country: '',
    chosen_country: '',
    status: 0,
    state: null,
    city: null,
    street: null,
    zip: null,
    gender: null,
    registration_contact_type: '',
    birthday: null,
    birthday_verified: false,
    nick_name: null,
    multi_account: false,
    support_manager_id: null,
    localization: configI18nConfig.getDefaultLocale(),
    hash: 'b1927c79f364c5bcaebecb38aeabaae155ffa215',
    phones: [
      {
        phone: '',
        is_primary: true,
        is_verified: false,
      },
    ],
    emails: [
      {
        email: '',
        is_primary: true,
        is_verified: false,
      },
    ],
    verification: {
      isVerified: false,
      isAntiFraudVerified: false,
      status: VerificationsStatusOld.INITIAL,
      verificationStatus: VerificationsStatus.INITIAL,
      paymentMethods: [],
    },
    user_type: '',
    vipManager: null,
    selfExclusionStatus: null,
  };
}
