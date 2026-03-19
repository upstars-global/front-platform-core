import { computed } from "vue";
import { COOLING_OFF_DURATIONS, COOLING_OFF_TRANSLATE_MAP } from "../config";

export function useCoolingOffDuration() {

    const coolingOffDurations = computed(() => {
        return COOLING_OFF_DURATIONS.map((duration) => {
            return {
              label: `LIMITS.SELF_EXCLUSION.DURATION_TYPES.${COOLING_OFF_TRANSLATE_MAP[duration.type]}`,
              value: [duration.value || 1, duration.type].join('_'),
              duration,
            };
        });
    });

    function getDurationByKey(key: string) {
        const duration = coolingOffDurations.value.find(({ value }) => {
            return value === key;
        });

        return duration?.duration;
    }

    return {
        coolingOffDurations,
        getDurationByKey,
    };
}
