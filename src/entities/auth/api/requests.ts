import { http } from '@core/shared/libs/http';

export async function register(): Promise<string> {
  return await http('abracadabra');
}
