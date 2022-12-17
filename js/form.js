import { checkStringLength, isEscapeKey } from './utils.js';
import { MAX_STRING_LENGTH, MAX_HASHTAG_COUNT, MAX_HASHTAG_LENGTH, ErrorMessage } from './consts.js';
import { setDefaultScale } from './scale.js';
import { setDefaultEffect } from './effects.js';

const body = document.querySelector('body');
const submitBtn = document.querySelector('.img-upload__submit');
const imgUploadField = document.querySelector('#upload-file');
const form = document.querySelector('.img-upload__form');
const editImg = document.querySelector('.img-upload__overlay');
const closeBtn = form.querySelector('.img-upload__cancel');
const hashtagsField = form.querySelector('.text__hashtags');
const commentsField = form.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text'
});

const closeUploadPopup  = () => {
  editImg.classList.add('hidden');
  body.classList.remove('modal-open');
  form.reset();
};

const onBtnEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    closeUploadPopup();
    document.removeEventListener('keydown', onBtnEscKeydown);
  }
};

const onCloseBtnClick = () => {
  closeUploadPopup();
  document.removeEventListener('keydown', onBtnEscKeydown);
};

const addFieldListeners = (field) => {
  field.addEventListener('focus', () => {
    document.removeEventListener('keydown', onBtnEscKeydown);
  });
  field.addEventListener('blur', () => {
    document.addEventListener('keydown', onBtnEscKeydown);
  });
};

const adjustBtn = () => {
  submitBtn.disabled = !pristine.validate();
};

const onImgUploadFieldchange = () => {
  editImg.classList.remove('hidden');
  body.classList.add('modal-open');
  closeBtn.addEventListener('click', onCloseBtnClick);
  document.addEventListener('keydown',onBtnEscKeydown);
  addFieldListeners(commentsField);
  addFieldListeners(hashtagsField);
  adjustBtn();
};

const getUniqueHashtags = (hashtags) => {
  const uniqueSet = new Set(hashtags);
  return hashtags.length === uniqueSet.size;
};

let errorMessage = '';

const error = () => errorMessage;

const hashtagsHandler = (string) => {
  errorMessage = '';

  const inputText = string.toLowerCase().trim();

  if(!inputText) {
    return true;
  }

  const inputHashtags = inputText.split(/\s+/);

  if(inputHashtags.length === 0) {
    return true;
  }

  const rules = [
    {
      check: inputHashtags.some((item) => item.indexOf('#', 1) >= 1),
      error: ErrorMessage.SEPARETED_BY_SPASES,
    },

    {
      check: inputHashtags.length > MAX_HASHTAG_COUNT,
      error: ErrorMessage.MAX_COUNT_HASHTAG,
    },

    {
      check: inputHashtags.some((item) => item[0] !== '#'),
      error: ErrorMessage.START_WITH,
    },

    {
      check: inputHashtags.some((item) => item.length > MAX_HASHTAG_LENGTH),
      error: ErrorMessage.HASHTAG_MAX_LENTH,
    },

    {
      check: inputHashtags.some((item) => !/^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(item)),
      error: ErrorMessage.UNACCEPTABLE_SYMBOLS,
    },

    {
      check: !getUniqueHashtags(inputHashtags),
      error: ErrorMessage.NO_REPEAT,
    },
  ];

  return rules.every((rule) => {
    const isInvalid = rule.check;
    if(isInvalid) {
      errorMessage = rule.error;
    }
    return !isInvalid;
  });
};

const commentHandler = (string) => {
  errorMessage = '';

  const inputText = string.trim();

  if(!inputText) {
    return true;
  }

  const rule = {
    check: !checkStringLength(inputText, MAX_STRING_LENGTH),
    error: ErrorMessage.COMMENT_MAX_LENGTH,
  };

  const isInvalid = rule.check;
  if(isInvalid) {
    errorMessage = rule.error;
  }
  return !isInvalid;
};

const validateForm = () => {
  pristine.addValidator(hashtagsField, hashtagsHandler, error);
  pristine.addValidator(commentsField, commentHandler, error);
  adjustBtn();
};

const onHashtagInput = () => adjustBtn();

const onCommentInput = () => adjustBtn();

const initUploadForm = () => {
  imgUploadField.addEventListener('change', onImgUploadFieldchange);
  hashtagsField.addEventListener('input', onHashtagInput);
  commentsField.addEventListener('input', onCommentInput);
  validateForm();
};

const onFileInput = () => {
  editImg.classList.remove('hidden');
  document.body.classList.add('modal-open');
  closeBtn.addEventListener('click', closeUploadPopup);
  document.addEventListener('keydown', onBtnEscKeydown);
  form.addEventListener('submit', adjustBtn);

  setDefaultScale();
  setDefaultEffect();
};

export { initUploadForm, onFileInput };
