import { sendData } from './form-sending.js';

const MaxValues = {
  COMMENT_SYNBOLS: 140,
  HASHTAG_SYMBOLS: 20,
  HASHTAGS_COUNT: 5,
};

const form = document.querySelector('.img-upload__form');
const inputHashtag = form.querySelector('.text__hashtags');
const inputComment = form.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__text',
  errorClass: 'img-upload__text--invalid',
  successClass: 'img-upload__text--valid',
  errorTextParent: 'img-upload__text',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error-text',
});

let errorMessage = '';

const error = () => errorMessage;

const validateHashtag = (value) => {
  const inputText = value.toLowerCase().trim();

  if (!inputText) {
    return true;
  }

  const inputArray = inputText.split(/\s+/);

  if (inputArray.length === 0) {
    return true;
  }

  const rules = [
    {
      check: inputArray.some((item) => (item[0] === '#' && item.length === 1)),
      error: 'Хеш-тег не может состоять только из одной решётки',
    },
    {
      check: inputArray.some((item) => item.indexOf('#', 1) >= 1),
      error: 'Хэш-теги разделяются пробелами',
    },
    {
      check: inputArray.some((item) => item[0] !== '#'),
      error: 'Хэш-тег должен начинаться с символа #',
    },
    {
      check: inputArray.some((item, num, array) => array.includes(item, num + 1)),
      error: 'Хэш-теги не должны повторяться',
    },
    {
      check: inputArray.some((item) => item.length > MaxValues.HASHTAG_SYMBOLS),
      error: `Максимальная длина одного хэш-тега ${MaxValues.HASHTAG_SYMBOLS} символов, включая решётку`,
    },
    {
      check: inputArray.length > MaxValues.HASHTAGS_COUNT,
      error: `Нельзя указать больше ${MaxValues.HASHTAGS_COUNT} хэш-тегов`,
    },
    {
      check: inputArray.some((item) => !/^#[a-zа-яё0-9]{1,19}$/i.test(item)),
      error: 'Хэш-тег содержит недопустимые символы',
    }
  ];

  return rules.every((rule) => {
    const isInvalid = rule.check;
    if (isInvalid) {
      errorMessage = rule.error;
    }
    return !isInvalid;
  });
};

const validateComment = (value) => value.length <= MaxValues.COMMENT_SYNBOLS;

const onFormInput = (evt) => {
  evt.preventDefault();

  if (pristine.validate()) {
    sendData();
  }
};

const resetForm = () => {
  pristine.reset();
};

pristine.addValidator(inputHashtag, validateHashtag, error);

pristine.addValidator(inputComment, validateComment,
  `Длина комментария должна быть не более ${MaxValues.COMMENT_SYNBOLS} символов`,
);

export { onFormInput, resetForm };
