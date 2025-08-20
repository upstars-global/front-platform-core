import { jsonApi } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import type {
  IPhoneCodeList,
  ISeoMetaResource,
  ServerData,
  IStaticPageResource,
  IStaticPagesItemResource,
} from '../types';

export const serverAPI = {
  async loadServerData() {
    try {
      const { data } = await jsonApi<{
        data: ServerData;
      }>('/serverdata', { method: 'GET' });
      return data;
    } catch (error) {
      log.error('LOAD_SERVER_DATA', error);
    }
  },

  async loadSeoMeta(url: string) {
    try {
      const { data } = await jsonApi<{
        data: ISeoMetaResource;
      }>(`/seo/meta?path=${encodeURIComponent(url)}`, {
        method: 'GET',
      });
      return data;
    } catch (error) {
      log.error('LOAD_SEO_META', error);
    }
  },
  async sendPromoCode(code: string) {
    try {
      return await jsonApi<{ success: boolean }>('/promo-codes/activate', {
        data: { promo_code: code },
      });
    } catch (error) {
      log.error('SEND_PROMO_CODE', error);
    }
  },
  async getCurrentStaticPage(slug: string) {
    try {
      const { data } = await jsonApi<{
        data: IStaticPageResource;
      }>(`/static-pages/${slug}`, { method: 'GET' });

      return data;
    } catch (error) {
      log.error('GET_CURRENT_STATIC_PAGE', error);
    }
  },
  async loadStaticPages() {
    try {
      const { data } = await jsonApi<{ data: IStaticPagesItemResource[] }>('/static-pages', {
        method: 'GET',
      });

      return data;
    } catch (error) {
      log.error('LOAD_STATIC_PAGES', error);
    }
  },
  async loadCountriesData() {
    try {
      const { data } = await jsonApi<{
        data: IPhoneCodeList;
      }>('/treasury/phone-codes', { method: 'GET' });
      return data;
    } catch (error) {
      log.error('LOAD_PHONE_CODE', error);
    }
  },
};
