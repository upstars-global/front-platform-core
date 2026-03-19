import { computed } from "vue";
import { SELF_EXCLUSION_REASONS } from "../config";

export function useSelfExclusionReasons() {
  const selfExclusionReasons = computed(() => {
    return SELF_EXCLUSION_REASONS.map((key) => {
      return {
        label: `LIMITS.SELF_EXCLUSION.REASONS.${key}`,
        value: key,
      };
    });
  });

  return {
    selfExclusionReasons,
  };
}

