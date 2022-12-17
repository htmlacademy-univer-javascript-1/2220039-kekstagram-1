const STEP_SCALE = 25;
const MAX_SCALE_VALUE = 100;
const RADIX = 10;

const imageOverlay = document.querySelector('.img-upload__overlay');
const image = imageOverlay.querySelector('.img-upload__preview').querySelector('img');
const scaleControl = imageOverlay.querySelector('.img-upload__scale');
const scaleField = scaleControl.querySelector('.scale__control--value');

const setDefaultScale = () => {
  scaleField.value = `${MAX_SCALE_VALUE}%`;
  image.style = `transform: scale(${1})`;
};

const setCorrectValue = (value) => Math.min(Math.max(25, value), 100);

const onScaleControlClick = (evt) => {
  const target = evt.target;

  if (target.tagName === 'BUTTON') {
    let value = scaleField.value;
    value = scaleField.value.substr(0, value.length - 1);
    let scaleCoefficient = 1;

    if (target.classList.contains('scale__control--smaller')) {
      scaleCoefficient = -1;
    }

    value = parseInt(value, RADIX) + STEP_SCALE * scaleCoefficient;
    value = setCorrectValue(value);

    image.style = `transform: scale(${value / MAX_SCALE_VALUE})`;
    scaleField.value = `${value}%`;
  }
};

scaleControl.addEventListener('click', onScaleControlClick);

export { setDefaultScale };
