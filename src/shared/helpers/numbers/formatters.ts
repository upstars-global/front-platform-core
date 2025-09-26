import { COINS } from '../../config';

export function formatThousands(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value);
}

export function formatThousandsFromCoins(coins: number) {
  return formatThousands(coins / COINS);
}
