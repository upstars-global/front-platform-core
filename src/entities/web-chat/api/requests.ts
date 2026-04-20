import type { ChatJsonWebTokenResource } from './resources';
import { jsonHttp } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';

export const webChatAPI = {
  async loadJsonWebToken() {
    try {
      return await jsonHttp<ChatJsonWebTokenResource>('/fe-api/webchat/token');
    } catch (error) {
      log.error('LOAD_JSON_WEB_TOKEN', error);
    }
  }
}
