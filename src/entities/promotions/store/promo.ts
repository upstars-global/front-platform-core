import type {
  IPromoDataResource,
  IPromoListResource,
  IUserPromoResource,
} from "../api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePromoStore = defineStore("promo", () => {
  const promoList = ref<IPromoListResource[]>([]);
  function setPromoList(data: IPromoListResource[]) {
      promoList.value = data;
  }

  const activePromoData = ref<IPromoDataResource>();
  const isActivePromoDataLoaded = ref<boolean>(false);

  function setActivePromoData(data: IPromoDataResource) {
      activePromoData.value = data;
  }

  function setIsActivePromoDataLoaded(value: boolean) {
      isActivePromoDataLoaded.value = value;
  }

  const currentPromoData = ref<IPromoDataResource>();
  function setCurrentPromoData(data: IPromoDataResource) {
      currentPromoData.value = data;
  }

  function cleanCurrentPromo() {
      currentPromoData.value = undefined;
  }

  const userPromo = ref<IUserPromoResource[]>([]);
  function setUserPromo(data: IUserPromoResource[]) {
      userPromo.value = data;
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
      setPromoList,

      activePromoData,
      isActivePromoDataLoaded,
      setActivePromoData,
      setIsActivePromoDataLoaded,

      currentPromoData,
      setCurrentPromoData,
      cleanCurrentPromo,

      userPromo,
      setUserPromo,
      updateUserPromoData,
      cleanUserPromoData,
  };
});
