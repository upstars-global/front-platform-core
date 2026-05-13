import { isServer } from '../../../shared/helpers/ssr';

const SCRIPT_ID = 'Cookiebot';

export function injectGDPRScript(domainGroupId: string): void {
  if (isServer) return;
  if (document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = 'https://consent.cookiebot.com/uc.js';
  script.setAttribute('data-cbid', domainGroupId);
  script.type = 'text/javascript';
  document.head.appendChild(script);
}
