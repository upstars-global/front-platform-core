type CookieOptions = {
  // seconds after now
  expires?: number | Date | string;
  path?: string;
  [key: string]: unknown;
};

type CookieController = {
  get(name: string): string | undefined;
  set(name: string, val: string, opts?: CookieOptions): void;
};

const isServer = typeof window === 'undefined';

export default {
  get: (name) => {
    if (isServer) {
      return;
    }

    // eslint-disable-next-line no-useless-escape
    const pattern = new RegExp(`(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`);

    const matches = document.cookie.match(pattern);
    return matches ? decodeURIComponent(matches[1]) : undefined;
  },
  set: (name, val, opts) => {
    if (isServer) {
      return;
    }

    const options = opts || {};

    let expires = options.expires;

    if (typeof expires == 'number' && expires) {
      const date = new Date();
      date.setTime(date.getTime() + expires * 1000);
      expires = options.expires = date;
    }

    if (expires && expires instanceof Date) {
      options.expires = expires.toUTCString();
    }

    const value = encodeURIComponent(val);

    let updatedCookie = `${name}=${value}`;

    for (const propName in options) {
      if (propName) {
        updatedCookie = `${updatedCookie}; ${propName}`;
        const propValue = options[propName];

        if (propValue !== true) {
          updatedCookie = `${updatedCookie}=${propValue}`;
        }
      }
    }
    document.cookie = updatedCookie;
  },
} as CookieController;
