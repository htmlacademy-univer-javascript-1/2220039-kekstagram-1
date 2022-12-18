const RADIX = 10;

const Scale = {
  STEP: 25,
  MIN_VALUE: 25,
  MAX_VALUE: 100,
};

const imageOverlay = document.querySelector('.img-upload__overlay');
const image = imageOverlay.querySelector('.img-upload__preview').querySelector('img');
const scaleControl = imageOverlay.querySelector('.img-upload__scale');
const scaleField = scaleControl.querySelector('.scale__control--value');

const setDefaultScale = () => {
  scaleField.value = `${Scale.MAX_VALUE}%`;
  image.style = `transform: scale(${1})`;
};

const setCorrectValue = (value) => Math.min(Math.max(25, value), 100);

const onScaleControlClick = (evt) => {
  const target = evt.target;

  if (target.tagName === 'BUTTON') {
    let value = scaleField.value;
    value = scaleField.value.substr(0, value.length - 1);

    const scaleCoefficient = target.classList.contains('scale__control--smaller') ? -1 : 1;

    value = parseInt(value, RADIX) + Scale.STEP * scaleCoefficient;
    value = setCorrectValue(value);

    image.style = `transform: scale(${value / Scale.MAX_VALUE})`;
    scaleField.value = `${value}%`;
  }
};

scaleControl.addEventListener('click', onScaleControlClick);

export { setDefaultScale };
