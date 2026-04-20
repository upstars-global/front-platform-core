import type {
  ExchangePrizeResource,
  IPromoDataResource,
  IPromoListResource,
  IUserPromoResource,
} from "../api";
import { promoAPI } from "../api/requests";
import { promiseMemo } from "../../../shared/helpers/promise";
import { defineStore } from "pinia";
import { ref } from "vue";
import { configPromotions } from "../config";
import { useUserProfile } from "../../user/composables";

/**
 * @refactor rewrite to composable; store must not use composable, api, or another store
 */
export const usePromoStore = defineStore("promo", () => {
  const { isLoggedAsync } = useUserProfile();

  const promoList = ref<IPromoListResource[]>([]);

  async function loadPromoList(tag?: string | string[], page: number = 1, perPage: number = 15) {
      const response = await promoAPI.loadPromoList(tag, page, perPage);

      if (response?.data) {
          const filteredData = configPromotions.getFilterItemsFn()(response.data);
          promoList.value = filteredData;
          return filteredData;
      }
      return [];
  }

  const activePromoData = ref<IPromoDataResource>();
  const isActivePromoDataLoaded = ref<boolean>(false);

  const loadActivePromo = promiseMemo(async (): Promise<IPromoDataResource> => {
      const data = await promoAPI.loadActivePromo(await isLoggedAsync());

      isActivePromoDataLoaded.value = true;
      activePromoData.value = data;
      return data;
  });

  async function exchangePrize(
      actionId: string,
      prizeId: string,
      giftsNumber: number,
  ): Promise<ExchangePrizeResource> {
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

          if (currentPromoData.value?.slug) {
              await loadCurrentPromoBySlug(currentPromoData.value.slug);
          }
      }
      return data;
  }

  const currentPromoData = ref<IPromoDataResource>();
  async function loadCurrentPromoBySlug(slug: string): Promise<IPromoDataResource> {
      const data = await promoAPI.loadCurrentPromoBySlug(slug, await isLoggedAsync());
      currentPromoData.value = data;
      return data;
  }

  function cleanCurrentPromo() {
      currentPromoData.value = undefined;
  }
  const userPromo = ref<IUserPromoResource[]>([]);
  async function loadUserPromoData(): Promise<IUserPromoResource[] | void> {
      userPromo.value = await promoAPI.loadUserPromoData();
  }

  function updateUserPromoData(data: IUserPromoResource): void {
      userPromo.value = userPromo.value.map((promo: IUserPromoResource) => {
          return promo.id === data.id ? data : promo;
      });
  }

  function cleanUserPromoData() {
      userPromo.value = [];
  }

  return {
      promoList,
      loadPromoList,

      activePromoData,
      isActivePromoDataLoaded,
      loadActivePromo,

      currentPromoData,
      loadCurrentPromoBySlug,
      cleanCurrentPromo,
      exchangePrize,

      userPromo,
      loadUserPromoData,
      updateUserPromoData,
      cleanUserPromoData,
  };
});
