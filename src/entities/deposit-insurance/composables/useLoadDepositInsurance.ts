import { depositInsuranceAPI } from '../api';
import { useDepositInsuranceStore } from '../store/useDepositInsuranceStore';

export function useLoadDepositInsurance() {
  const { setInfo, setIsLoaded } = useDepositInsuranceStore();

  async function loadDepositInsurance() {
    try {
      setIsLoaded(false);

      const response = await depositInsuranceAPI.info();

      if (response?.data) {
        setInfo(response.data);
      }
    } finally {
      setIsLoaded(true);
    }
  }

  return {
    loadDepositInsurance,
  };
}
