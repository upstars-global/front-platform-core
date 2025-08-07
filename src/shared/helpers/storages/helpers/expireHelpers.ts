const MINUTE_EXPIRE = 60;
const HOUR_EXPIRE = MINUTE_EXPIRE * 60;
const DAY_EXPIRE = HOUR_EXPIRE * 24;
const MONTH_EXPIRE = DAY_EXPIRE * 31;
const MAX_EXPIRE = DAY_EXPIRE * 400;

// helpers to generate expire in seconds

export function expireCookieMax() {
  return () => MAX_EXPIRE;
}

export function expireMinutes(minutes = 1) {
  return () => MINUTE_EXPIRE * minutes;
}

export function expireHours(hours = 1) {
  return () => HOUR_EXPIRE * hours;
}

export function expireDays(days = 1) {
  return () => DAY_EXPIRE * days;
}

export function expireMonths(months = 1) {
  return () => MONTH_EXPIRE * months;
}

export function expireNextDayUTC() {
  return () => {
    const dt = new Date();
    dt.setUTCHours(0, 0, 0, 0);
    dt.setUTCDate(dt.getUTCDate() + 1);
    return Math.floor((dt.getTime() - Date.now()) / 1000);
  };
}
