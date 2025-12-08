import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { PhoneCodeList, PhoneCode } from "../types";

export const DEFAULT_COUNTRIES_DATA = {
    au: {
        code: "au",
        dialCode: 61,
        name: "Australia",
        example: "4 1234-5678",
    },
};

export const useCountriesDataStore = defineStore("countriesData", () => {
    const phoneCodeLoaded = ref(false);

    const phoneCodes = ref<PhoneCodeList>(DEFAULT_COUNTRIES_DATA);

    function setPhoneCodes(data: PhoneCodeList) {
        phoneCodes.value = data;
    }

    function setPhoneCodeLoaded(value: boolean) {
        phoneCodeLoaded.value = value;
    }

    const getCountries = computed<PhoneCode[]>(() => {
        return Object.values(phoneCodes.value);
    });

    return {
        phoneCodeLoaded,
        phoneCodes,
        setPhoneCodes,
        setPhoneCodeLoaded,
        getCountries,
    };
});
