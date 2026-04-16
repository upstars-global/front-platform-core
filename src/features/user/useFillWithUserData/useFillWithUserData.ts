import { useUserProfileStore } from '../../../entities/user/store/userProfileStore';

export function useFillWithUserData() {
  const userProfileStore = useUserProfileStore();

  function fillUserData(data: string): string {
    const userID = userProfileStore.userId || '';

    return data.replaceAll('[userID_value]', userID);
  }

  return {
    fillUserData,
  };
}
