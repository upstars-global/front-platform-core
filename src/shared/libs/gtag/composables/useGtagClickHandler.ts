import { onMounted, onBeforeUnmount, ref, type Ref } from 'vue';
import { log } from '../../../helpers';

/**
 * Тип для gtag події: [eventName, eventParams]
 */
export type GtagEventData = [string, Record<string, unknown>] | [string];

/**
 * Callback функція, яка викликається при кліку на елемент з data-gtag
 */
export type GtagClickCallback = (eventData: GtagEventData) => void;

/**
 * Опції для useGtagClickHandler
 */
export interface UseGtagClickHandlerOptions {
  /**
   * Callback функція для обробки gtag події
   */
  onGtagClick: GtagClickCallback;

  /**
   * Контейнер, в якому шукати елементи з data-gtag-event-name
   * За замовчуванням - document.body
   */
  container?: HTMLElement | Ref<HTMLElement | undefined>;

  /**
   * Чи автоматично ініціалізувати обробник при монтуванні
   * За замовчуванням - true
   */
  autoInit?: boolean;
}

/**
 * Composable для обробки HTML елементів з атрибутами data-gtag-event-name та data-gtag-param-*.
 * Автоматично знаходить елементи, збирає параметри і викликає callback при кліку.
 *
 * @example
 * ```ts
 * const { init, destroy } = useGtagClickHandler({
 *   onGtagClick: (eventData) => {
 *     const [eventName, eventParams] = eventData;
 *     console.log('Event:', eventName, 'Params:', eventParams);
 *   }
 * });
 * ```
 *
 * HTML приклад:
 * ```html
 * <button
 *   data-gtag-event-name="complete_the_survey_popup_open"
 *   data-gtag-param-field="embed"
 *   data-gtag-param-location="upper">
 *   Click me
 * </button>
 * ```
 *
 * Без параметрів:
 * ```html
 * <button data-gtag-event-name="button_click">Click me</button>
 * ```
 */
export function useGtagClickHandler(options: UseGtagClickHandlerOptions) {
  const { onGtagClick, container, autoInit = true } = options;

  const listeners = new Map<HTMLElement, EventListener>();
  const isInitialized = ref(false);

  /**
   * Парсить gtag дані з data-атрибутів
   */
  const parseGtagFromDataAttributes = (element: HTMLElement): GtagEventData | null => {
    const eventName = element.getAttribute('data-gtag-event-name');

    if (!eventName) {
      return null;
    }

    // Збираємо всі атрибути з префіксом data-gtag-param-*
    const params: Record<string, unknown> = {};
    const attributes = element.attributes;

    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      const attrName = attr.name;

      if (attrName.startsWith('data-gtag-param-')) {
        // Видаляємо префікс "data-gtag-param-" і конвертуємо в camelCase або snake_case
        const paramKey = attrName.replace('data-gtag-param-', '').replace(/-/g, '_');
        params[paramKey] = attr.value;
      }
    }

    // Якщо немає параметрів, повертаємо просто назву події
    if (Object.keys(params).length === 0) {
      return [eventName];
    }

    return [eventName, params];
  };

  /**
   * Обробник кліку на елемент
   */
  const handleClick = (element: HTMLElement) => () => {
    const eventData = parseGtagFromDataAttributes(element);

    if (eventData) {
      try {
        onGtagClick(eventData);
      } catch (error) {
        log.error('GTAG_CALLBACK_ERROR', { eventData, error });
      }
    }
  };

  /**
   * Отримує контейнер для пошуку елементів
   */
  const getContainer = (): HTMLElement => {
    if (!container) {
      return document.body;
    }

    // Якщо передано Ref
    if ('value' in container) {
      return container.value || document.body;
    }

    return container;
  };

  /**
   * Ініціалізує обробники кліків для всіх елементів з data-gtag-event-name
   */
  const init = () => {
    if (isInitialized.value) {
      log.warn('GTAG_ALREADY_INITIALIZED', 'useGtagClickHandler вже ініціалізовано');
      return;
    }

    const containerElement = getContainer();
    const elements = containerElement.querySelectorAll<HTMLElement>('[data-gtag-event-name]');

    elements.forEach((element) => {
      const listener = handleClick(element);
      element.addEventListener('click', listener);
      listeners.set(element, listener);
    });

    isInitialized.value = true;

    log.info('GTAG_INITIALIZED', { elementsCount: elements.length });
  };

  /**
   * Видаляє всі обробники кліків
   */
  const destroy = () => {
    listeners.forEach((listener, element) => {
      element.removeEventListener('click', listener);
    });

    listeners.clear();
    isInitialized.value = false;

    log.info('GTAG_DESTROYED');
  };

  /**
   * Повторно ініціалізує обробники (корисно при динамічному додаванні елементів)
   */
  const reinit = () => {
    destroy();
    init();
  };

  // Автоматична ініціалізація при монтуванні
  if (autoInit) {
    onMounted(() => {
      init();
    });
  }

  // Автоматична очистка при демонтуванні
  onBeforeUnmount(() => {
    destroy();
  });

  return {
    /**
     * Чи ініціалізовано обробник
     */
    isInitialized,

    /**
     * Ініціалізувати обробники кліків
     */
    init,

    /**
     * Видалити всі обробники
     */
    destroy,

    /**
     * Повторно ініціалізувати обробники
     */
    reinit,
  };
}
