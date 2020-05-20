
export function debounce (fn, { timeout=200 }) {
  let timer = null;

  return function () {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn();
      timer = null;
    }, timeout);
  }
}

export function h0 (timestamp) {
  const h0Date = timestamp ? new Date(timestamp) : new Date();
  h0Date.setHours(0);
  h0Date.setMinutes(0);
  h0Date.setSeconds(0);
  h0Date.setMilliseconds(0);
  return h0Date.getTime();
}
