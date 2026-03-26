import { computed } from "vue";
import { SELF_EXCLUSION_DURATIONS, TRANSLATE_MAP } from "../config";

export function useSelfExclusionDurations() {

    const selfExclusionDurations = computed(() => {
        return SELF_EXCLUSION_DURATIONS.map((duration) => {
            return {
              label: `LIMITS.SELF_EXCLUSION.DURATION_TYPES.${TRANSLATE_MAP[duration.type]}`,
              value: [duration.value || 1, duration.type].join('_'),
              duration,
            };
        });
    });

    function getDurationByKey(key: string) {
        const duration = selfExclusionDurations.value.find(({ value }) => {
            return value === key;
        });

        return duration?.duration;
    }

    return {
        selfExclusionDurations,
        getDurationByKey,
    };
}
