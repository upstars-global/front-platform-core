import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import { useGtagClickHandler } from './useGtagClickHandler';

// Mock log helper
vi.mock('../../../helpers', () => {
  return {
    log: {
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
    },
  };
});

// Mock Vue lifecycle hooks
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    onMounted: (fn: () => void) => fn(),
    onBeforeUnmount: vi.fn(),
  };
});

// Mock DOM Element
type MockElement = {
  tagName: string;
  attributes: Record<string, string>;
  listeners: Record<string, EventListener[]>;
  children: MockElement[];
  setAttribute: (name: string, value: string) => void;
  getAttribute: (name: string) => string | null;
  addEventListener: (event: string, listener: EventListener) => void;
  removeEventListener: (event: string, listener: EventListener) => void;
  appendChild: (child: MockElement) => MockElement;
  removeChild: (child: MockElement) => MockElement;
  querySelectorAll: (selector: string) => MockElement[];
  click: () => void;
};

const createMockElement = (tag: string): MockElement => {
  const attributesMap: Record<string, string> = {};
  const listeners: Record<string, EventListener[]> = {};
  const children: MockElement[] = [];

  return {
    tagName: tag.toUpperCase(),
    get attributes() {
      // Повертаємо масив-подібний об'єкт з атрибутами
      const keys = Object.keys(attributesMap);
      const result = keys.map((key) => ({
        name: key,
        value: attributesMap[key],
      }));
      Object.defineProperty(result, 'length', { value: keys.length });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result as any;
    },
    listeners,
    children,
    setAttribute(name: string, value: string) {
      attributesMap[name] = value;
    },
    getAttribute(name: string) {
      return attributesMap[name] || null;
    },
    addEventListener(event: string, listener: EventListener) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(listener);
    },
    removeEventListener(event: string, listener: EventListener) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((l) => l !== listener);
      }
    },
    appendChild(child: MockElement) {
      children.push(child);
      return child;
    },
    removeChild(child: MockElement) {
      const index = children.indexOf(child);
      if (index > -1) {
        children.splice(index, 1);
      }
      return child;
    },
    querySelectorAll(selector: string) {
      const results: MockElement[] = [];

      if (selector === '[data-gtag-event-name]') {
        const collectElements = (el: MockElement) => {
          if (el.getAttribute('data-gtag-event-name') !== null) {
            results.push(el);
          }
          el.children.forEach(collectElements);
        };
        children.forEach(collectElements);
      }

      return results;
    },
    click() {
      if (listeners['click']) {
        listeners['click'].forEach((listener) => {
          listener({} as Event);
        });
      }
    },
  };
};

describe('useGtagClickHandler', () => {
  let container: MockElement;
  let callback: ReturnType<typeof vi.fn>;
  let mockDocument: { body: MockElement; createElement: (tag: string) => MockElement };

  beforeEach(() => {
    container = createMockElement('div');
    callback = vi.fn();

    mockDocument = {
      body: createMockElement('body'),
      createElement: createMockElement,
    };

    // Mock global document
    global.document = mockDocument as unknown as Document;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should find and attach click handlers to elements with data-gtag-event-name', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'test_event');
      button.setAttribute('data-gtag-param-field', 'value');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
        autoInit: true,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith(['test_event', { field: 'value' }]);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple elements with data-gtag-event-name', () => {
      const button1 = mockDocument.createElement('button');
      button1.setAttribute('data-gtag-event-name', 'event_1');
      button1.setAttribute('data-gtag-param-id', '1');

      const button2 = mockDocument.createElement('button');
      button2.setAttribute('data-gtag-event-name', 'event_2');
      button2.setAttribute('data-gtag-param-id', '2');

      container.appendChild(button1);
      container.appendChild(button2);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
        autoInit: true,
      });

      button1.click();
      button2.click();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, ['event_1', { id: '1' }]);
      expect(callback).toHaveBeenNthCalledWith(2, ['event_2', { id: '2' }]);
    });

    it('should not auto-initialize when autoInit is false', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'test_event');
      container.appendChild(button);

      const { isInitialized } = useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
        autoInit: false,
      });

      button.click();

      expect(callback).not.toHaveBeenCalled();
      expect(isInitialized.value).toBe(false);
    });
  });

  describe('Manual initialization', () => {
    it('should initialize when init() is called manually', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'manual_event');
      container.appendChild(button);

      const { init, isInitialized } = useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
        autoInit: false,
      });

      expect(isInitialized.value).toBe(false);

      init();

      expect(isInitialized.value).toBe(true);

      button.click();

      expect(callback).toHaveBeenCalledWith(['manual_event']);
    });

    it('should warn when trying to initialize twice', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'test_event');
      container.appendChild(button);

      const { init } = useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
        autoInit: false,
      });

      init();
      init(); // Second call should warn

      button.click();

      // Should only attach listeners once
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data parsing', () => {
    it('should parse event with parameters', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'complete_the_survey_popup_open');
      button.setAttribute('data-gtag-param-field', 'embed');
      button.setAttribute('data-gtag-param-location', 'upper');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith([
        'complete_the_survey_popup_open',
        { field: 'embed', location: 'upper' },
      ]);
    });

    it('should parse event without parameters', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'simple_event');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith(['simple_event']);
    });

    it('should convert kebab-case to snake_case in parameter names', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'test_event');
      button.setAttribute('data-gtag-param-user-id', '123');
      button.setAttribute('data-gtag-param-first-name', 'John');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith([
        'test_event',
        { user_id: '123', first_name: 'John' },
      ]);
    });

    it('should handle mixed parameter formats', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'mixed_event');
      button.setAttribute('data-gtag-param-simple', 'value');
      button.setAttribute('data-gtag-param-kebab-case', 'kebab');
      button.setAttribute('data-gtag-param-under_score', 'underscore');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith([
        'mixed_event',
        { simple: 'value', kebab_case: 'kebab', under_score: 'underscore' },
      ]);
    });

    it('should not call callback for element without event name', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-param-field', 'value');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle empty parameter values', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'empty_param_event');
      button.setAttribute('data-gtag-param-empty', '');
      button.setAttribute('data-gtag-param-filled', 'value');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith(['empty_param_event', { empty: '', filled: 'value' }]);
    });

    it('should handle numeric string values in parameters', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'numeric_event');
      button.setAttribute('data-gtag-param-count', '42');
      button.setAttribute('data-gtag-param-price', '19.99');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith([
        'numeric_event',
        { count: '42', price: '19.99' },
      ]);
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on destroy', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'test_event');
      container.appendChild(button);

      const { destroy } = useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();
      expect(callback).toHaveBeenCalledTimes(1);

      destroy();

      button.click();
      expect(callback).toHaveBeenCalledTimes(1); // Should not increase
    });

    it('should clear isInitialized flag on destroy', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'test_event');
      container.appendChild(button);

      const { destroy, isInitialized } = useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      expect(isInitialized.value).toBe(true);

      destroy();

      expect(isInitialized.value).toBe(false);
    });
  });

  describe('Reinit', () => {
    it('should reinitialize handlers for new elements', () => {
      const button1 = mockDocument.createElement('button');
      button1.setAttribute('data-gtag-event-name', 'event_1');
      container.appendChild(button1);

      const { reinit } = useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button1.click();
      expect(callback).toHaveBeenCalledWith(['event_1']);
      expect(callback).toHaveBeenCalledTimes(1);

      const button2 = mockDocument.createElement('button');
      button2.setAttribute('data-gtag-event-name', 'event_2');
      container.appendChild(button2);

      reinit();

      button2.click();
      expect(callback).toHaveBeenCalledWith(['event_2']);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should remove old listeners when reinitializing', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'test_event');
      container.appendChild(button);

      const { reinit } = useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();
      expect(callback).toHaveBeenCalledTimes(1);

      reinit();

      button.click();
      // Should still be 2, not 3 (old + new listener would be 3)
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('Container handling', () => {
    it('should use document.body when no container is provided', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'body_event');
      mockDocument.body.appendChild(button);

      const { destroy } = useGtagClickHandler({
        onGtagClick: callback,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith(['body_event']);

      destroy();
    });

    it('should work with ref container', () => {
      const containerRef = ref<HTMLElement | undefined>(container as unknown as HTMLElement);

      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'ref_event');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: containerRef,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith(['ref_event']);
    });

    it('should fallback to document.body when ref container is undefined', () => {
      const containerRef = ref<HTMLElement | undefined>(undefined);

      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'fallback_event');
      mockDocument.body.appendChild(button);

      const { destroy } = useGtagClickHandler({
        onGtagClick: callback,
        container: containerRef,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith(['fallback_event']);

      destroy();
    });
  });

  describe('Error handling', () => {
    it('should handle callback errors gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Callback error');
      });

      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'error_event');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: errorCallback,
        container: container as unknown as HTMLElement,
      });

      expect(() => button.click()).not.toThrow();
      expect(errorCallback).toHaveBeenCalled();
    });

    it('should handle elements without data-gtag-event-name attribute', () => {
      const button = mockDocument.createElement('button');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle empty container', () => {
      const { isInitialized } = useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      expect(isInitialized.value).toBe(true);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('GtagEventData types', () => {
    it('should accept event with just a name', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'event_only');
      container.appendChild(button);

      const typedCallback = vi.fn();

      useGtagClickHandler({
        onGtagClick: typedCallback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(typedCallback).toHaveBeenCalledWith(['event_only']);
    });

    it('should accept event with name and params', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'event_with_params');
      button.setAttribute('data-gtag-param-key', 'value');
      container.appendChild(button);

      const typedCallback = vi.fn();

      useGtagClickHandler({
        onGtagClick: typedCallback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(typedCallback).toHaveBeenCalledWith(['event_with_params', { key: 'value' }]);
    });
  });

  describe('Edge cases', () => {
    it('should handle multiple clicks on the same element', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'multi_click');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();
      button.click();
      button.click();

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenCalledWith(['multi_click']);
    });

    it('should handle deeply nested elements', () => {
      const wrapper1 = mockDocument.createElement('div');
      const wrapper2 = mockDocument.createElement('div');
      const button = mockDocument.createElement('button');

      button.setAttribute('data-gtag-event-name', 'nested_event');
      wrapper2.appendChild(button);
      wrapper1.appendChild(wrapper2);
      container.appendChild(wrapper1);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith(['nested_event']);
    });

    it('should handle special characters in event names', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'event_with-dash_and_underscore');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith(['event_with-dash_and_underscore']);
    });

    it('should handle unicode characters in parameters', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'unicode_event');
      button.setAttribute('data-gtag-param-text', 'Привіт 你好 مرحبا');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith(['unicode_event', { text: 'Привіт 你好 مرحبا' }]);
    });

    it('should handle many parameters', () => {
      const button = mockDocument.createElement('button');
      button.setAttribute('data-gtag-event-name', 'many_params_event');
      button.setAttribute('data-gtag-param-param1', 'value1');
      button.setAttribute('data-gtag-param-param2', 'value2');
      button.setAttribute('data-gtag-param-param3', 'value3');
      button.setAttribute('data-gtag-param-param4', 'value4');
      button.setAttribute('data-gtag-param-param5', 'value5');
      container.appendChild(button);

      useGtagClickHandler({
        onGtagClick: callback,
        container: container as unknown as HTMLElement,
      });

      button.click();

      expect(callback).toHaveBeenCalledWith([
        'many_params_event',
        {
          param1: 'value1',
          param2: 'value2',
          param3: 'value3',
          param4: 'value4',
          param5: 'value5',
        },
      ]);
    });
  });
});