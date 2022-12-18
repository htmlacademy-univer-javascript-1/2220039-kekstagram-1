const Effects = {
  STEP: 0.01,
  MAX_VALUE: 100,
  RADIX: 10,
  MAX_BLUR_VALUE: 3,
  MAX_HEAT_VALUE: 3,
};

const Slider = {
  MIN: 0,
  MAX: Effects.MAX_VALUE,
  STEP: 1,
};

const form = document.querySelector('.img-upload__form');
const effectsList = form.querySelector('.effects__list');
const preview = form.querySelector('.img-upload__preview');
const image = preview.querySelector('img');
const effectLevel = form.querySelector('.img-upload__effect-level');
const effectLevelValue = form.querySelector('.effect-level__value');
const slider = form.querySelector('.effect-level__slider');
const defaultImageClass = image.classList[0];

let currentEffect = '';

noUiSlider.create(slider, {
  range: {
    min: Slider.MIN,
    max: Slider.MAX,
  },
  start: Slider.MAX,
  step: Slider.STEP,
  connect: 'lower',
});

const getEffectStep = (effectMaxValue) => effectMaxValue * Effects.STEP;

effectLevel.classList.add('visually-hidden');

const effects = {
  none: () => {
    effectLevel.classList.add('visually-hidden');
    return 'none';
  },

  chrome: () => {
    effectLevel.classList.remove('visually-hidden');
    return `grayscale(${parseInt(effectLevelValue.value, Effects.RADIX) * getEffectStep(1)})`;
  },

  sepia: () => {
    effectLevel.classList.remove('visually-hidden');
    return `sepia(${parseInt(effectLevelValue.value, Effects.RADIX) * getEffectStep(1)})`;
  },

  marvin: () => {
    effectLevel.classList.remove('visually-hidden');
    return `invert(${parseInt(effectLevelValue.value, Effects.RADIX) * getEffectStep(Effects.MAX_VALUE)}%) `;
  },

  phobos: () => {
    effectLevel.classList.remove('visually-hidden');
    return `blur(${parseInt(effectLevelValue.value, Effects.RADIX) * getEffectStep(Effects.MAX_BLUR_VALUE)}px)`;
  },

  heat: () => {
    effectLevel.classList.remove('visually-hidden');
    const effectMin = Slider.MAX / (Effects.MAX_HEAT_VALUE - 1);
    return `brightness(${(effectMin + parseInt(effectLevelValue.value, Effects.RADIX)) * getEffectStep(Effects.MAX_HEAT_VALUE - 1)})`;
  },
};

const setDefaultEffect = () => {
  effectLevel.classList.add('visually-hidden');

  image.className = defaultImageClass;
  image.style.filter = effects.none;
};

const setEffect = (effect) => {
  image.style.filter = effects[effect.replace('effects__preview--', '')]();
};

const onEffectsListClick = (evt) => {
  let target = evt.target;

  if (target.classList.contains('effects__label')) {
    target = evt.target.querySelector('span');
  }

  if (target.classList.contains('effects__preview')) {
    if (currentEffect !== '') {
      image.classList.remove(currentEffect);
    }

    slider.noUiSlider.set(Slider.MAX);
    effectLevelValue.value = Slider.MAX;

    currentEffect = target.classList[1];
    image.classList.add(currentEffect);
    setEffect(currentEffect);
  }
};

const onSliderChange = () => {
  effectLevelValue.value = slider.noUiSlider.get();
  setEffect(currentEffect);
};

slider.noUiSlider.on('change', onSliderChange);
effectsList.addEventListener('click', onEffectsListClick);

export { setDefaultEffect };
