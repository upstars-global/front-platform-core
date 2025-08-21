import { computed, onBeforeMount, ref } from 'vue';
import { type LocalStorageKeyControllerOptions, LocalStorageKeyController } from '../../controllers';

export function useLocalStorageValueByController<T>(controller: LocalStorageKeyController<T>) {
  const value = ref<T>(controller.getDefaultValue());

  onBeforeMount(() => {
    value.value = controller.get();
  });

  return {
    value: computed<T>({
      get() {
        return value.value;
      },
      set(newValue) {
        if (typeof window !== 'undefined') {
          value.value = newValue;
          controller.set(newValue);
        }
      },
    }),
    clear() {
      if (typeof window !== 'undefined') {
        controller.clear();
      }
    },
  };
}

export function useLocalStorageValue<T>(key: string, options: LocalStorageKeyControllerOptions<T>) {
  const controller = new LocalStorageKeyController(key, options);
  return useLocalStorageValueByController(controller);
}
