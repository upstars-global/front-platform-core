import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { filterPayments } from './filterPayments';
import type { PaymentMethodResource } from '../../../../entities/cashbox';
import {
  SelfExclusionStatus,
  useUserProfileStore,
  VerificationsStatus,
  VerificationsStatusOld,
  type UserProfileResource,
} from '../../../../entities/user';

describe('filterPayments', () => {
  const mockPaymentMethod = (overrides: Partial<PaymentMethodResource> = {}): PaymentMethodResource => ({
    id: 'payment-1',
    fee: 0,
    icons: [],
    isLocked: false,
    kycVerificationRequired: false,
    limits: [],
    name: 'Test Payment',
    originalRouteName: 'test_route',
    routeName: 'test-route',
    tags: [],
    treasuryOrderingPosition: 0,
    ...overrides,
  });

  // Helper to create user info for the store
  const createUserInfo = (isVerified: boolean, isAntiFraudVerified: boolean): UserProfileResource => ({
    birthday_verified: true,
    hash: 'test-hash',
    multi_account: false,
    localization: 'en-US',
    selfExclusionStatus: SelfExclusionStatus.COOLING_OFF_INIT,
    support_manager_id: '123',
    verification: {
      isVerified,
      isAntiFraudVerified,
      status: VerificationsStatusOld.INITIAL,
      verificationStatus: VerificationsStatus.INITIAL,
      paymentMethods: [],
    },
    id: 'user-1',
    user_id: 'user-1',
    lastname: null,
    firstname: null,
    middlename: null,
    address: null,
    country: 'US',
    chosen_country: 'US',
    status: 0,
    state: null,
    city: null,
    street: null,
    zip: null,
    gender: null,
    registration_contact_type: 'email',
    birthday: null,
    emails: [],
    phones: [],
    nick_name: null,
    user_type: 'regular',
    vipManager: null,
    isSuspended: false,
  });

  beforeEach(() => {
    setActivePinia(createPinia());
  });
  describe('when user is verified', () => {
    beforeEach(() => {
      const userProfileStore = useUserProfileStore();
      userProfileStore.setUserInfo(createUserInfo(true, false));
    });

    it('should return all payments when none require KYC verification', () => {
      const payments: PaymentMethodResource[] = [
        mockPaymentMethod({ id: '1', kycVerificationRequired: false }),
        mockPaymentMethod({ id: '2', kycVerificationRequired: false }),
        mockPaymentMethod({ id: '3', kycVerificationRequired: false }),
      ];

      const result = filterPayments(payments);

      expect(result).toHaveLength(3);
      expect(result).toEqual(payments);
    });

    it('should return payments when all require KYC verification', () => {
      const payments: PaymentMethodResource[] = [
        mockPaymentMethod({ id: '1', kycVerificationRequired: true }),
        mockPaymentMethod({ id: '2', kycVerificationRequired: true }),
      ];

      const result = filterPayments(payments);

      expect(result).toHaveLength(2);
      expect(result).toEqual(payments);
    });
  });

  describe('when user is anti-fraud verified', () => {
    beforeEach(() => {
      const userProfileStore = useUserProfileStore();
      userProfileStore.setUserInfo(createUserInfo(false, true));
    });

    it('should return all payments including those requiring KYC verification', () => {
      const payments: PaymentMethodResource[] = [
        mockPaymentMethod({ id: '1', kycVerificationRequired: false }),
        mockPaymentMethod({ id: '2', kycVerificationRequired: true }),
        mockPaymentMethod({ id: '3', kycVerificationRequired: false }),
      ];

      const result = filterPayments(payments);

      expect(result).toHaveLength(3);
      expect(result).toEqual(payments);
    });
  });

  describe('when user is both verified and anti-fraud verified', () => {
    beforeEach(() => {
      const userProfileStore = useUserProfileStore();
      userProfileStore.setUserInfo(createUserInfo(true, true));
    });

    it('should return all payments including those requiring KYC verification', () => {
      const payments: PaymentMethodResource[] = [
        mockPaymentMethod({ id: '1', kycVerificationRequired: true }),
        mockPaymentMethod({ id: '2', kycVerificationRequired: true }),
      ];

      const result = filterPayments(payments);

      expect(result).toHaveLength(2);
      expect(result).toEqual(payments);
    });
  });

  describe('when user is not verified', () => {
    beforeEach(() => {
      const userProfileStore = useUserProfileStore();
      userProfileStore.setUserInfo(createUserInfo(false, false));
    });

    it('should filter out payments requiring KYC verification', () => {
      const payments: PaymentMethodResource[] = [
        mockPaymentMethod({ id: '1', kycVerificationRequired: false }),
        mockPaymentMethod({ id: '2', kycVerificationRequired: true }),
        mockPaymentMethod({ id: '3', kycVerificationRequired: false }),
      ];

      const result = filterPayments(payments);

      expect(result).toHaveLength(2);
      expect(result).toEqual([payments[0], payments[2]]);
      expect(result.every(p => !p.kycVerificationRequired)).toBe(true);
    });

    it('should return empty array when all payments require KYC verification', () => {
      const payments: PaymentMethodResource[] = [
        mockPaymentMethod({ id: '1', kycVerificationRequired: true }),
        mockPaymentMethod({ id: '2', kycVerificationRequired: true }),
      ];

      const result = filterPayments(payments);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should return all payments when none require KYC verification', () => {
      const payments: PaymentMethodResource[] = [
        mockPaymentMethod({ id: '1', kycVerificationRequired: false }),
        mockPaymentMethod({ id: '2', kycVerificationRequired: false }),
      ];

      const result = filterPayments(payments);

      expect(result).toHaveLength(2);
      expect(result).toEqual(payments);
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      const userProfileStore = useUserProfileStore();
      userProfileStore.setUserInfo(createUserInfo(false, false));
    });

    it('should return empty array when given empty array', () => {
      const result = filterPayments([]);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle single payment method', () => {
      const payments: PaymentMethodResource[] = [
        mockPaymentMethod({ id: '1', kycVerificationRequired: false }),
      ];

      const result = filterPayments(payments);

      expect(result).toHaveLength(1);
      expect(result).toEqual(payments);
    });

    it('should preserve payment order when filtering', () => {
      const payments: PaymentMethodResource[] = [
        mockPaymentMethod({ id: '1', name: 'Payment A', kycVerificationRequired: false }),
        mockPaymentMethod({ id: '2', name: 'Payment B', kycVerificationRequired: true }),
        mockPaymentMethod({ id: '3', name: 'Payment C', kycVerificationRequired: false }),
        mockPaymentMethod({ id: '4', name: 'Payment D', kycVerificationRequired: false }),
      ];

      const result = filterPayments(payments);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Payment A');
      expect(result[1].name).toBe('Payment C');
      expect(result[2].name).toBe('Payment D');
    });
  });
});
