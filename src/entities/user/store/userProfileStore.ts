import { defineStore } from 'pinia';
import {
  type ICreateContactResource,
  type IUserContactsOnVerificationResource,
  type UserProfileResource,
  VerificationsStatus,
  VerificationsStatusOld,
} from '../api';
import { generateInitialProfileData } from './generateInitialProfileData';
import { computed, ref } from 'vue';
import { RegistrationType } from '../../../shared/api';

export const useUserProfileStore = defineStore('userProfileStore', () => {
  const userInfo = ref<UserProfileResource>(generateInitialProfileData());
  const userInfoLoaded = ref<boolean>(false);
  const contactsOnVerification = ref<IUserContactsOnVerificationResource[]>([]);

  function setUserInfo(data: UserProfileResource) {
    userInfo.value = {
      ...userInfo.value,
      ...data,
    };
  }
  function cleanUserInfo() {
    userInfo.value = generateInitialProfileData();
  }
  function cleanContactsOnVerification() {
    contactsOnVerification.value = [];
  }

  function setUserInfoLoaded(value: boolean) {
    userInfoLoaded.value = value;
  }

  const vipManagerData = computed(() => {
    return userInfo.value.vipManager;
  });
  const userId = computed(() => {
    return userInfo.value.user_id;
  });
  const isLogged = computed(() => {
    return Boolean(userInfo.value.user_id);
  });
  const userCountryCode = computed(() => {
    return userInfo.value.chosen_country;
  });
  const userPhone = computed(() => {
    const primaryPhone = userInfo.value.phones.find((item) => item.is_primary);
    return primaryPhone?.phone || '';
  });
  const userEmail = computed(() => {
    const primaryEmail = userInfo.value.emails.find((item) => item.is_primary);
    return primaryEmail?.email || '';
  });

  const isVerifiedEmail = computed(() => {
    const emails = userInfo.value.emails;
    const primaryEmail = emails.find((item) => item.is_primary);

    return primaryEmail ? primaryEmail.is_verified : false;
  });
  const isVerifiedIncomePayments = computed(() => {
    // Getter that return boolean according to verified Users all income payments (requirement of AML policy)
    if (!userInfo.value.verification.paymentMethods || !userInfo.value.verification.paymentMethods.length) {
      return true;
    }
    // Assumption: expect up to 5 items in array. Most cases there is just one
    return userInfo.value.verification.paymentMethods.every((method) => method.isVerified);
  });
  const isVerifiedPhone = computed(() => {
    const phones = userInfo.value.phones;
    const primaryPhone = phones.find((item) => item.is_primary);

    return primaryPhone ? primaryPhone.is_verified : false;
  });

  const isPersonalDataSaved = computed(() => {
    let isContactsSaved = false;
    const phoneOnVerification = contactsOnVerification.value.find((item) => {
      return item.type === RegistrationType.PHONE;
    });
    const emailOnVerification = contactsOnVerification.value.find((item) => {
      return item.type === RegistrationType.EMAIL;
    });

    if (userEmail.value) {
      if (phoneOnVerification || userPhone.value) {
        isContactsSaved = true;
      }
    } else if (emailOnVerification) {
      isContactsSaved = true;
    }

    return Boolean(isContactsSaved && userInfo.value.firstname && userInfo.value.lastname && userInfo.value.birthday);
  });
  const isAddressDataSaved = computed(() => {
    return Boolean(userInfo.value.city && userInfo.value.state && userInfo.value.street && userInfo.value.zip);
  });
  const isBrazilDataSaved = computed(() => {
    return Boolean(userInfo.value.firstname && userInfo.value.lastname && userPhone.value && userInfo.value.zip);
  });
  const verificationStatusVerified = computed(() => {
    return userInfo.value.verification.status === VerificationsStatusOld.VERIFIED;
  });
  const verificationStatusPending = computed(() => {
    return userInfo.value.verification.verificationStatus === VerificationsStatus.PENDING;
  });
  const verificationStatusApproved = computed(() => {
    return userInfo.value.verification.verificationStatus === VerificationsStatus.APPROVED;
  });
  const isSuspended = computed(() => {
    return Boolean(userInfo.value.isSuspended);
  });

  function setEmailVerify(email: string) {
    userInfo.value.emails = userInfo.value.emails.map((item) => {
      if (item.is_primary) {
        return Object.assign({}, item, { email });
      }

      return item;
    });
  }

  function setUserContact(data: ICreateContactResource) {
    const type = data.type;
    const baseData = {
      is_primary: true,
      is_verified: false,
    };
    if (type === RegistrationType.EMAIL) {
      userInfo.value.emails.push({
        ...baseData,
        email: data.value,
      });
    } else {
      userInfo.value.phones.push({
        ...baseData,
        phone: data.value,
      });
    }
  }

  function setContactsOnVerification(data: IUserContactsOnVerificationResource[]) {
    contactsOnVerification.value = data;
  }
  function contactOnVerificationByType(type: string) {
    return contactsOnVerification.value.find((item: IUserContactsOnVerificationResource) => {
      return item.type === type;
    });
  }

  return {
    userInfo,
    userInfoLoaded,
    isLogged,
    userId,

    userCountryCode,
    userPhone,
    userEmail,
    vipManagerData,

    isVerifiedEmail,
    isVerifiedPhone,
    isVerifiedIncomePayments,

    isPersonalDataSaved,
    isAddressDataSaved,
    isBrazilDataSaved,
    verificationStatusVerified,
    verificationStatusPending,
    verificationStatusApproved,
    isSuspended,

    setUserInfo,
    cleanUserInfo,
    cleanContactsOnVerification,
    setUserInfoLoaded,
    setEmailVerify,
    setUserContact,
    contactOnVerificationByType,
    setContactsOnVerification,
  };
});
