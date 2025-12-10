import { useUserProfileStore } from '../../../entities/user/store/userProfileStore';

export function useFillWithUserData() {
  const userProfileStore = useUserProfileStore();

  function fillUserData(data: string): string {
    const userID = userProfileStore.userId || '';
    const email = userProfileStore.userEmail || '';

    return data.replaceAll('[userID_value]', userID).replaceAll('[email_value]', email);
  }

  return {
    fillUserData,
  };
}
