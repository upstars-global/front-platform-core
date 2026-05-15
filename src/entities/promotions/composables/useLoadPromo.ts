import { promoAPI } from "../api/requests";
import { promiseMemo } from "../../../shared/helpers/promise";
import { configPromotions } from "../config";
import { useUserProfile } from "../../user/composables";
import { usePromoStore } from "../store";

export function useLoadPromo() {
  const store = usePromoStore();
  const { isLoggedAsync } = useUserProfile();

  async function loadPromoList(tag?: string | string[], page: number = 1, perPage: number = 15) {
      const response = await promoAPI.loadPromoList(tag, page, perPage);

      if (response?.data) {
          const filteredData = configPromotions.getFilterItemsFn()(response.data);
          store.setPromoList(filteredData);
          return filteredData;
      }
      return [];
  }

  const loadActivePromo = promiseMemo(async () => {
      const data = await promoAPI.loadActivePromo(await isLoggedAsync());

      store.setIsActivePromoDataLoaded(true);
      store.setActivePromoData(data);
      return data;
  });

  async function exchangePrize(
      actionId: string,
      prizeId: string,
      giftsNumber: number,
  ) {
      const data = await promoAPI.exchangePrize(
          {
              actionId,
              prizeId,
              giftsNumber,
          },
          await isLoggedAsync(),
      );

      if (!data?.error) {
          await loadActivePromo();

          if (store.currentPromoData?.slug) {
              await loadCurrentPromoBySlug(store.currentPromoData.slug);
          }
      }
      return data;
  }

  async function loadCurrentPromoBySlug(slug: string) {
      const data = await promoAPI.loadCurrentPromoBySlug(slug, await isLoggedAsync());
      store.setCurrentPromoData(data);
      return data;
  }

  async function loadUserPromoData() {
      const data = await promoAPI.loadUserPromoData();
      store.setUserPromo(data);
  }

  return {
      loadPromoList,
      loadActivePromo,
      exchangePrize,
      loadCurrentPromoBySlug,
      loadUserPromoData,
  };
}
