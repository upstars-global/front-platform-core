import {
  type PublicApiV1ResponsePagination,
  publicApiV1,
  publicApiV2,
  jsonApi,
  jsonHttp,
} from "../../../shared/libs/http";
import { log } from "../../../shared/helpers/log";
import {
  type IGiftActivateResource,
  type IGiftAllResource,
  type IGiftResource,
  type IGiftResourceV2,
  type IGetUserGiftsDTO,
  GetUserGiftsAvailability,
} from "../../../shared/api";

interface GetGiftsListResponse {
  total: number;
  items: IGiftResource[];
}

export const giftsAPI = {
  async cancelBonus(id: string, userGiftId?: string) {
      try {
          await publicApiV1({
              url: "balances/bonuses/cancel",
              secured: true,
              type: (securedType) => `Balance.V1.${securedType}.Bonuses.CancelBonus`,
              data: {
                  data: { id, userGiftId },
              },
          });
      } catch (error) {
          log.error("CANCEL_BONUS", error);
      }
  },

  async getAllUserGiftsV2(): Promise<IGiftAllResource> {
      try {
          const response = await publicApiV2<IGiftAllResource>({
              url: "gifts/user-gifts/list/all",
              secured: true,
              type: (securedType) => `Gift.V2.${securedType}.Gift.UserGiftsListAll`,
          });
          if (response.error) {
              log.error("LOAD_ALL_GIFTS_DATA_V2", response.error.description);
          } else {
              return response.data;
          }
      } catch (error) {
          log.error("LOAD_ALL_GIFTS_DATA_V2", error);
      }

      return {
          [GetUserGiftsAvailability.ACTIVE]: [],
          [GetUserGiftsAvailability.AVAILABLE]: [],
      };
  },

  async getUserGiftsV2(params: IGetUserGiftsDTO): Promise<{
      items: IGiftResourceV2[];
      pagination: PublicApiV1ResponsePagination;
  }> {
      const {
          pageNumber = 1,
          perPage = 10,
      } = params.pagination || {};

      try {
          const response = await publicApiV2<IGiftResourceV2[]>({
              url: "gifts/user-gifts/list",
              secured: true,
              type: (securedType) => `Gift.V2.${securedType}.Gift.UserGiftsList`,
              data: {
                  filter: params.filter,
                  pagination: {
                      pageNumber,
                      perPage,
                  },
              },
          });
          if (response.error) {
              log.error("LOAD_GIFTS_DATA_V2", response.error.description);
          } else {
              return {
                  items: response.data,
                  pagination: {
                      total: response.pagination?.total || response.data.length,
                      pageNumber: response.pagination?.pageNumber || pageNumber,
                      perPage: response.pagination?.perPage || perPage,
                  },
              };
          }
      } catch (error) {
          log.error("LOAD_GIFTS_DATA_V2", error);
      }

      return {
          items: [],
          pagination: {
              total: 0,
              pageNumber: pageNumber,
              perPage: perPage,
          },
      };
  },

  async getGiftsList() {
      try {
          const response = await publicApiV1<GetGiftsListResponse>({
              url: "gifts/user-gifts/list",
              type: (securedType) => `Gift.V1.${securedType}.Gift.UserGiftsList`,
              secured: true,
          });
          return response.data || {
              total: 0,
              items: [],
          };
      } catch (error) {
          log.error("LOAD_GIFTS_DATA", error);
      }
      return {
          total: 0,
          items: [],
      };
  },
  async activateGift(id: string) {
      try {
          return await jsonHttp<IGiftActivateResource>(`/app/gifts/activate/${ id }`, {
              method: "PUT",
          });
      } catch (error) {
          log.error("ACTIVATE_GIFT", error);
      }
  },
  async activatePromoGift(giftName: string) {
      try {
          return await jsonHttp(`/promogifts/activate/${ giftName }`);
      } catch (error) {
          log.error("ACTIVATE_PROMO_GIFT", error);
      }
  },
  async takeNonDepositGiftPrize(id: string) {
      try {
          return await jsonApi<{
              success: boolean;
              error: string;
          }>(`/gifts/nondeposit/take-prize/${ id }`);
      } catch (error) {
          log.error("TAKE_NON_DEPOSIT_GIFT", error);
      }
  },
  async sendCurrentGift(giftId: string, operationId: string) {
      try {
          await jsonApi("/user-gifts/cashbox-select", {
              data: {
                  user_gift_id: giftId,
                  operation_id: operationId,
              },
          });
      } catch (error) {
          log.error("SEND_CURRENT_GIFT", error);
      }
  },
  async loadPayoutGiftCount() {
      try {
          const { data } = await jsonApi<{
              data: {
                  count: number;
              };
          }>("/user-gifts/payout-gift-count", {
              method: "GET",
          });
          return data.count;
      } catch (error) {
          log.error("LOAD_PAYOUT_GIFT_COUNT", error);
      }
      return 0;
  },
  async activatePromoGiftByCode(code: string): Promise<boolean | void> {
      try {
          const response = await publicApiV2({
              url: "/gifts/promo-gifts/activate",
              secured: true,
              type: (securedType) => `Gift.V2.${securedType}.PromoGift.Activate`,
              data: {
                  data: {
                      code,
                  },
              },
          });

          return !response.error;
      } catch (error: unknown) {
          log.error("ACTIVE_PROMO_GIFT_BY_CODE", error);
      }
  },
};
