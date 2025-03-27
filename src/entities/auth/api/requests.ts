import { http } from '@core/shared/libs/http';

export async function register(): Promise<void> {
  return await http('abracadabra test');
}
