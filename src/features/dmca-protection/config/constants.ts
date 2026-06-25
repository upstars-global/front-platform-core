// DMCA.com badge status page. The project-wide account id is appended as the `ID` query param.
export const DMCA_STATUS_URL_BASE = 'https://www.dmca.com/Protection/Status.aspx?ID=';

// Query param DMCA expects for click-through attribution (the current page url).
// Mirrors the official DMCABadgeHelper.min.js behavior without loading the 3rd-party script.
export const DMCA_REFURL_PARAM = 'refurl';
