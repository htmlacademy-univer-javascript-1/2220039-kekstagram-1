const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const checkStringLength = (string, length) => string.length <= length;

const isEscapeKey = (evt) => evt.key === 'Escape';

export { getRandomPositiveInteger, checkStringLength, isEscapeKey };
