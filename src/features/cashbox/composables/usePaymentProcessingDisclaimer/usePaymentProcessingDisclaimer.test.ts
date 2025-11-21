import { describe, it, expect, vi, beforeEach } from 'vitest';
import { computed } from 'vue';
import { usePaymentProcessingDisclaimer } from './usePaymentProcessingDisclaimer';
import { PAYMENT_METHOD } from '../../../../entities/cashbox';
import type { PaymentMethodResource } from '../../../../entities/cashbox';
import { useCashboxStore } from '../../store';
import { isTargetPaymentProcessor } from '../../helpers';
import { createPinia, setActivePinia } from 'pinia';

// Mock the helper
vi.mock('../../helpers/isTargetPaymentProcessor', () => ({
  isTargetPaymentProcessor: vi.fn(),
}));


describe('usePaymentProcessingDisclaimer', () => {
  const mockPayment = (routeName: string): PaymentMethodResource => ({
    id: 'payment-1',
    fee: 0,
    icons: [],
    isLocked: false,
    kycVerificationRequired: false,
    limits: [],
    name: 'Test Payment',
    originalRouteName: 'test',
    routeName,
    tags: [],
    treasuryOrderingPosition: 0,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('activeDepositPaymentIsInterac', () => {
    it('should return true when deposit payment is Interac', () => {
      const mockDepositPayment = mockPayment(PAYMENT_METHOD.INTERAC);
      setActivePinia(createPinia());

      const cashboxStore = useCashboxStore();
      cashboxStore.setDepositPayment(mockDepositPayment);

      vi.mocked(isTargetPaymentProcessor).mockReturnValue(true);

      const { activeDepositPaymentIsInterac } = usePaymentProcessingDisclaimer();

      expect(activeDepositPaymentIsInterac.value).toBe(true);
      expect(isTargetPaymentProcessor).toHaveBeenCalledWith({
        processorId: PAYMENT_METHOD.INTERAC,
        targetId: PAYMENT_METHOD.INTERAC,
      });
    });

    it('should return false when deposit payment is not Interac', () => {
      const mockDepositPayment = mockPayment('visa');

      setActivePinia(createPinia());

      const cashboxStore = useCashboxStore();
      cashboxStore.setDepositPayment(mockDepositPayment);

      vi.mocked(isTargetPaymentProcessor).mockReturnValue(false);

      const { activeDepositPaymentIsInterac } = usePaymentProcessingDisclaimer();

      expect(activeDepositPaymentIsInterac.value).toBe(false);
      expect(isTargetPaymentProcessor).toHaveBeenCalledWith({
        processorId: 'visa',
        targetId: PAYMENT_METHOD.INTERAC,
      });
    });

    it('should return false when deposit payment is null', () => {
      setActivePinia(createPinia());

      const cashboxStore = useCashboxStore();

      cashboxStore.setDepositPayment(null as unknown as PaymentMethodResource);

      vi.mocked(isTargetPaymentProcessor).mockReturnValue(false);

      const { activeDepositPaymentIsInterac } = usePaymentProcessingDisclaimer();

      expect(activeDepositPaymentIsInterac.value).toBe(false);
      expect(isTargetPaymentProcessor).toHaveBeenCalledWith({
        processorId: undefined,
        targetId: PAYMENT_METHOD.INTERAC,
      });
    });

    it('should handle empty routeName', () => {
      const mockDepositPayment = mockPayment('');

      setActivePinia(createPinia());

      const cashboxStore = useCashboxStore();

      cashboxStore.setDepositPayment(mockDepositPayment);


      vi.mocked(isTargetPaymentProcessor).mockReturnValue(false);

      const { activeDepositPaymentIsInterac } = usePaymentProcessingDisclaimer();

      expect(activeDepositPaymentIsInterac.value).toBe(false);
      expect(isTargetPaymentProcessor).toHaveBeenCalledWith({
        processorId: '',
        targetId: PAYMENT_METHOD.INTERAC,
      });
    });

    it('should be reactive to changes in deposit payment', () => {
      const mockDepositPaymentVisa = mockPayment('visa');
      const mockDepositPaymentInterac = mockPayment(PAYMENT_METHOD.INTERAC);

      // Create a reactive ref for depositPayment
      const depositPaymentRef = computed(() => mockDepositPaymentVisa);

      setActivePinia(createPinia());

      const cashboxStore = useCashboxStore();

      cashboxStore.setDepositPayment(depositPaymentRef.value);

      // First call returns false
      vi.mocked(isTargetPaymentProcessor).mockReturnValueOnce(false);

      const { activeDepositPaymentIsInterac } = usePaymentProcessingDisclaimer();

      expect(activeDepositPaymentIsInterac.value).toBe(false);

      // Update mock to return Interac payment
      cashboxStore.setDepositPayment(mockDepositPaymentInterac);

      // Second call returns true
      vi.mocked(isTargetPaymentProcessor).mockReturnValueOnce(true);

      const { activeDepositPaymentIsInterac: updatedValue } = usePaymentProcessingDisclaimer();

      expect(updatedValue.value).toBe(true);
    });

    it('should call isTargetPaymentProcessor with correct parameters', () => {
      const mockDepositPayment = mockPayment('mastercard');

      setActivePinia(createPinia());

      const cashboxStore = useCashboxStore();

      cashboxStore.setDepositPayment(mockDepositPayment);


      vi.mocked(isTargetPaymentProcessor).mockReturnValue(false);

      const { activeDepositPaymentIsInterac } = usePaymentProcessingDisclaimer();

      // Access the computed value to trigger the function call
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      activeDepositPaymentIsInterac.value;

      expect(isTargetPaymentProcessor).toHaveBeenCalledTimes(1);
      expect(isTargetPaymentProcessor).toHaveBeenCalledWith({
        processorId: 'mastercard',
        targetId: PAYMENT_METHOD.INTERAC,
      });
    });
  });

  describe('computed property behavior', () => {
    it('should return a computed value that can be accessed multiple times', () => {
      const mockDepositPayment = mockPayment(PAYMENT_METHOD.INTERAC);

      setActivePinia(createPinia());

      const cashboxStore = useCashboxStore();

      cashboxStore.setDepositPayment(mockDepositPayment);


      vi.mocked(isTargetPaymentProcessor).mockReturnValue(true);

      const { activeDepositPaymentIsInterac } = usePaymentProcessingDisclaimer();

      // Access the computed property multiple times
      expect(activeDepositPaymentIsInterac.value).toBe(true);
      expect(activeDepositPaymentIsInterac.value).toBe(true);
      expect(activeDepositPaymentIsInterac.value).toBe(true);
    });
  });
});
