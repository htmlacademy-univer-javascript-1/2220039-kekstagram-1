const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

const isEscKey = (evt) => evt.key === 'Escape';

const checkForRepeats = (list) => {
  const containerForComparison = {};
  for (const element of list) {
    if (containerForComparison[element]) {
      return true;
    }
    containerForComparison[element] = 1;
  }
  return false;
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

export { getRandomPositiveInteger, isEscKey, checkForRepeats, debounce };
