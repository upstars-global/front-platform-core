import { useUserProfileStore } from '../../../entities/user/store/userProfileStore';

export function useUserWithCredentials() {
  const userProfileStore = useUserProfileStore();

  function fillUrlWithUserCredentials(url: string): string {
    const userID = userProfileStore.userId || '';
    const email = userProfileStore.userEmail || '';

    return url.replace('[userID_value]', userID).replace('[email_value]', email);
  }

  return {
    fillUrlWithUserCredentials,
  };
}
