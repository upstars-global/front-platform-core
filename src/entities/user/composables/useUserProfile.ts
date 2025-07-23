import type { Pinia } from 'pinia';
import { useUserProfileStore } from '../store';
import { userEvents } from '../emitter';
import { type IUpdateUserProfileDTO, userAPI } from '../api';
import { promiseMemo } from '../../../shared/helpers/promise';
import { isServer } from '../../../shared/helpers/ssr';

export interface ILoadUserProfileParams {
  reload?: boolean;
  localeRedirectUrl?: string;
}

export function useUserProfile(pinia?: Pinia) {
  const userProfileStore = useUserProfileStore(pinia);

  const loadUserProfile = promiseMemo(
    async (params?: ILoadUserProfileParams) => {
      if (isServer) {
        return userProfileStore.userInfo;
      }

      const { reload = false } = params || {};

      if (userProfileStore.userInfo.id && !reload) {
        return userProfileStore.userInfo;
      }
      userProfileStore.setUserInfoLoaded(false);

      const data = await userAPI.loadUserProfile();
      userProfileStore.setUserInfo(data);

      if (data?.user_id) {
        userEvents.emit('user.data.received');
      }

      userProfileStore.setUserInfoLoaded(true);
      return data;
    },
    {
      key: 'loadUserProfile',
    },
  );

  async function updateUserProfile(data: IUpdateUserProfileDTO) {
    const response = await userAPI.updateUserProfile(data);

    if (!response.success) {
      return response.errors;
    }
    await loadUserProfile({ reload: true });
  }

  async function updateUserNickname(nickname: string) {
    userProfileStore.setUserInfo({
      ...userProfileStore.userInfo,
      nick_name: nickname,
    });
    await userAPI.updateUserNickname(nickname);
  }

  async function addPhone(phone: string) {
    const data = await userAPI.addPhone(phone);

    if (data?.data) {
      userProfileStore.setUserContact(data.data);
    }
    return data;
  }

  async function isLoggedAsync() {
    if (isServer) {
      return false;
    }

    if (!userProfileStore.userInfoLoaded) {
      await loadUserProfile();
    }
    return userProfileStore.isLogged;
  }

  async function loadUserContactsOnVerification() {
    const response = await userAPI.loadContactsOnVerification();
    if (response?.data) {
      userProfileStore.setContactsOnVerification(response.data);
    }
  }

  return {
    loadUserProfile,
    updateUserProfile,
    updateUserNickname,
    addPhone,
    loadUserContactsOnVerification,
    isLoggedAsync,
  };
}
