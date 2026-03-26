import { limitsAPI } from '../../../entities/limits';

export type UseGetSelfExclusionToken = () => {
  getToken: () => string | null;
  removeToken: () => void;
};

export function useSelfExclusionToken(
  useGetToken: UseGetSelfExclusionToken,
  expiredCallback?: () => void
) {
  const { getToken, removeToken } = useGetToken();

  async function handleSelfExclusionToken() {
    const token = getToken();
    if (token) {
      const status = await limitsAPI.checkSelfExclusionToken(token);

      if (!status) {
        if (expiredCallback) {
          expiredCallback();
        }
        removeToken();
      }

      return true;
    }
    return false;
  }

  return {
    handleSelfExclusionToken,
  };
}
