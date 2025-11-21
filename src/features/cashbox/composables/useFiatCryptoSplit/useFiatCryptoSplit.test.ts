import { describe, it, expect } from 'vitest';
import { ref, nextTick } from 'vue';
import { useFiatCryptoSplit, CRYPTO_TAG, type CryptoPayment } from './useFiatCryptoSplit';

describe('useFiatCryptoSplit', () => {
  const createPayment = (_: string, tags: string[], originalRouteName: string): CryptoPayment => ({
    tags,
    originalRouteName,
  });

  describe('fiatPayments', () => {
    it('should filter out crypto payments and return only fiat payments', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', ['fiat'], 'visa'),
        createPayment('2', [CRYPTO_TAG], 'btc'),
        createPayment('3', ['fiat'], 'mastercard'),
      ]);

      const { fiatPayments } = useFiatCryptoSplit(payments);

      expect(fiatPayments.value).toHaveLength(2);
      expect(fiatPayments.value[0].originalRouteName).toBe('visa');
      expect(fiatPayments.value[1].originalRouteName).toBe('mastercard');
    });

    it('should return all payments when none are crypto', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', ['fiat'], 'visa'),
        createPayment('2', ['bank'], 'wire'),
        createPayment('3', ['card'], 'amex'),
      ]);

      const { fiatPayments } = useFiatCryptoSplit(payments);

      expect(fiatPayments.value).toHaveLength(3);
    });

    it('should return empty array when all payments are crypto', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', [CRYPTO_TAG], 'btc'),
        createPayment('2', [CRYPTO_TAG], 'eth'),
      ]);

      const { fiatPayments } = useFiatCryptoSplit(payments);

      expect(fiatPayments.value).toHaveLength(0);
    });

    it('should filter payments even when crypto tag is combined with other tags', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', ['fiat', 'popular'], 'visa'),
        createPayment('2', [CRYPTO_TAG, 'popular'], 'btc'),
        createPayment('3', ['fiat'], 'mastercard'),
      ]);

      const { fiatPayments } = useFiatCryptoSplit(payments);

      expect(fiatPayments.value).toHaveLength(2);
      expect(fiatPayments.value.every(p => !p.tags.includes(CRYPTO_TAG))).toBe(true);
    });
  });

  describe('cryptoPayments', () => {
    it('should filter and return only crypto payments', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', ['fiat'], 'visa'),
        createPayment('2', [CRYPTO_TAG], 'btc'),
        createPayment('3', [CRYPTO_TAG], 'eth'),
      ]);

      const { cryptoPayments } = useFiatCryptoSplit(payments);

      expect(cryptoPayments.value).toHaveLength(2);
      expect(cryptoPayments.value.every(p => p.tags.includes(CRYPTO_TAG))).toBe(true);
    });

    it('should sort crypto payments according to CRYPTO_OVERRIDE_ORDER (btc, eth, usdt)', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', [CRYPTO_TAG], 'usdt'),
        createPayment('2', [CRYPTO_TAG], 'eth'),
        createPayment('3', [CRYPTO_TAG], 'btc'),
        createPayment('4', [CRYPTO_TAG], 'ltc'),
      ]);

      const { cryptoPayments } = useFiatCryptoSplit(payments);

      expect(cryptoPayments.value[0].originalRouteName).toBe('btc');
      expect(cryptoPayments.value[1].originalRouteName).toBe('eth');
      expect(cryptoPayments.value[2].originalRouteName).toBe('usdt');
      expect(cryptoPayments.value[3].originalRouteName).toBe('ltc');
    });

    it('should place unlisted crypto currencies at the end', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', [CRYPTO_TAG], 'doge'),
        createPayment('2', [CRYPTO_TAG], 'btc'),
        createPayment('3', [CRYPTO_TAG], 'xrp'),
        createPayment('4', [CRYPTO_TAG], 'eth'),
      ]);

      const { cryptoPayments } = useFiatCryptoSplit(payments);

      expect(cryptoPayments.value[0].originalRouteName).toBe('btc');
      expect(cryptoPayments.value[1].originalRouteName).toBe('eth');
      // doge and xrp should be at the end, order between them is preserved
      expect(cryptoPayments.value[2].originalRouteName).toBe('doge');
      expect(cryptoPayments.value[3].originalRouteName).toBe('xrp');
    });

    it('should handle empty array', () => {
      const payments = ref<CryptoPayment[]>([]);

      const { cryptoPayments } = useFiatCryptoSplit(payments);

      expect(cryptoPayments.value).toHaveLength(0);
    });
  });

  describe('shortCryptoPayments', () => {
    it('should return first 3 crypto payments when showAllCrypto is false', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', [CRYPTO_TAG], 'btc'),
        createPayment('2', [CRYPTO_TAG], 'eth'),
        createPayment('3', [CRYPTO_TAG], 'usdt'),
        createPayment('4', [CRYPTO_TAG], 'ltc'),
        createPayment('5', [CRYPTO_TAG], 'xrp'),
      ]);

      const { shortCryptoPayments, showAllCrypto } = useFiatCryptoSplit(payments);

      // With >3 crypto payments, showAllCrypto should be false due to watcher
      expect(showAllCrypto.value).toBe(false);

      expect(shortCryptoPayments.value).toHaveLength(3);
      expect(shortCryptoPayments.value[0].originalRouteName).toBe('btc');
      expect(shortCryptoPayments.value[1].originalRouteName).toBe('eth');
      expect(shortCryptoPayments.value[2].originalRouteName).toBe('usdt');
    });

    it('should return all crypto payments when showAllCrypto is true', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', [CRYPTO_TAG], 'btc'),
        createPayment('2', [CRYPTO_TAG], 'eth'),
        createPayment('3', [CRYPTO_TAG], 'usdt'),
        createPayment('4', [CRYPTO_TAG], 'ltc'),
      ]);

      const { shortCryptoPayments, showAllCrypto } = useFiatCryptoSplit(payments);

      showAllCrypto.value = true;

      expect(shortCryptoPayments.value).toHaveLength(4);
      expect(shortCryptoPayments.value).toEqual(shortCryptoPayments.value);
    });
  });

  describe('showAllCrypto watcher', () => {
    it('should set showAllCrypto to true when crypto payments <= 3', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', [CRYPTO_TAG], 'btc'),
        createPayment('2', [CRYPTO_TAG], 'eth'),
        createPayment('3', [CRYPTO_TAG], 'usdt'),
      ]);

      const { showAllCrypto } = useFiatCryptoSplit(payments);

      expect(showAllCrypto.value).toBe(true);
    });

    it('should set showAllCrypto to false when crypto payments > 3', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', [CRYPTO_TAG], 'btc'),
        createPayment('2', [CRYPTO_TAG], 'eth'),
        createPayment('3', [CRYPTO_TAG], 'usdt'),
        createPayment('4', [CRYPTO_TAG], 'ltc'),
      ]);

      const { showAllCrypto } = useFiatCryptoSplit(payments);

      expect(showAllCrypto.value).toBe(false);
    });

    it('should update showAllCrypto when payments change', async () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', [CRYPTO_TAG], 'btc'),
        createPayment('2', [CRYPTO_TAG], 'eth'),
      ]);

      const { showAllCrypto } = useFiatCryptoSplit(payments);

      expect(showAllCrypto.value).toBe(true);

      // Add more crypto payments
      payments.value = [
        createPayment('1', [CRYPTO_TAG], 'btc'),
        createPayment('2', [CRYPTO_TAG], 'eth'),
        createPayment('3', [CRYPTO_TAG], 'usdt'),
        createPayment('4', [CRYPTO_TAG], 'ltc'),
      ];

      await nextTick();
      expect(showAllCrypto.value).toBe(false);

      // Remove crypto payments
      payments.value = [
        createPayment('1', [CRYPTO_TAG], 'btc'),
      ];

      await nextTick();
      expect(showAllCrypto.value).toBe(true);
    });

    it('should only count crypto payments for showAllCrypto threshold', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', ['fiat'], 'visa'),
        createPayment('2', ['fiat'], 'mastercard'),
        createPayment('3', [CRYPTO_TAG], 'btc'),
        createPayment('4', [CRYPTO_TAG], 'eth'),
      ]);

      const { showAllCrypto } = useFiatCryptoSplit(payments);

      // Only 2 crypto payments, so should be true
      expect(showAllCrypto.value).toBe(true);
    });
  });

  describe('reactivity', () => {
    it('should reactively update when payments array changes', () => {
      const payments = ref<CryptoPayment[]>([
        createPayment('1', ['fiat'], 'visa'),
        createPayment('2', [CRYPTO_TAG], 'btc'),
      ]);

      const { fiatPayments, cryptoPayments } = useFiatCryptoSplit(payments);

      expect(fiatPayments.value).toHaveLength(1);
      expect(cryptoPayments.value).toHaveLength(1);

      // Update payments
      payments.value = [
        createPayment('1', ['fiat'], 'visa'),
        createPayment('2', ['fiat'], 'mastercard'),
        createPayment('3', [CRYPTO_TAG], 'btc'),
        createPayment('4', [CRYPTO_TAG], 'eth'),
      ];

      expect(fiatPayments.value).toHaveLength(2);
      expect(cryptoPayments.value).toHaveLength(2);
    });
  });
});
