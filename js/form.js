import { isEscKey, checkForRepeats } from './utils.js';
import { form, addEventListenerImage, removeEventListenerImage, addFilter, removeFilters, scaleValueElement } from './effects.js';
import { sendDataToServer } from './api.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const MAX_LENGTH_COMMENT = 140;
const MAX_LENGTH_HASHTAG = 20;
const MAX_HASHTAGS_COUNT = 5;
const re = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
let messageHashtagError = '';

const HashtagRule = {
  HASHTAG_SYMBOL: 'Хэш-тег начинается с символа # (решётка).',
  VALID_CHARACTERS: 'Cтрока после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д..',
  ONLY_HASHTAG: 'Хеш-тег не может состоять только из одной решётки.',
  MAX_LENGTH: 'Максимальная длина одного хэш-тега 20 символов, включая решётку.',
  NO_REPEAT: 'Один и тот же хэш-тег не может быть использован дважды.',
  MAX_COUNT: 'Нельзя указать больше пяти хэш-тегов.',
  OKAY: ''
};

const body = document.querySelector('body');
const loadImgBtnElement = form.querySelector('#upload-file');
const editingWindowElement = form.querySelector('.img-upload__overlay');
const closeBtnElement = editingWindowElement.querySelector('#upload-cancel');
const submitBtnElement = form.querySelector('.img-upload__submit');
const hashtagsInputElement = form.querySelector('input[name="hashtags"]');
const descriptionInputElement = form.querySelector('textarea[name="description"]');
const preview = document.querySelector('.img-upload__preview img');
const successFormTemplate = document.querySelector('#success').content.querySelector('.success');
const errorFormTemplate = document.querySelector('#error').content.querySelector('.error');
const errorBtnElement = errorFormTemplate.querySelector('.error__button');
const successBtnElement = successFormTemplate.querySelector('.success__button');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'img-upload__error'
}, true);

const validateHashtag = (value) => {
  messageHashtagError = HashtagRule.OKAY;
  value = value.trim().toLowerCase();
  const hashtags = value.split(' ');
  if (hashtags[0] !== '') {
    for (const hashtag of hashtags) {
      if (!re.test(hashtag)) {
        if (hashtag[0] !== '#') {
          messageHashtagError = HashtagRule.HASHTAG_SYMBOL;
          return false;
        }
        if (hashtag.length === 1 && hashtag[0] === '#') {
          messageHashtagError = HashtagRule.ONLY_HASHTAG;
          return false;
        }
        if (hashtag.length > MAX_LENGTH_HASHTAG) {
          messageHashtagError = HashtagRule.MAX_LENGTH;
          return false;
        }
        messageHashtagError = HashtagRule.VALID_CHARACTERS;
        return false;
      }
    }
    if (hashtags.length > MAX_HASHTAGS_COUNT) {
      messageHashtagError = HashtagRule.MAX_COUNT;
      return false;
    }
    if (checkForRepeats(hashtags)) {
      messageHashtagError = HashtagRule.NO_REPEAT;
      return false;
    }
  }
  return true;
};

const generateMessageHashtags = () => messageHashtagError;

const validateDescription = (value) => value.length <= MAX_LENGTH_COMMENT;

pristine.addValidator(hashtagsInputElement, validateHashtag, generateMessageHashtags);
pristine.addValidator(descriptionInputElement, validateDescription, 'Длина комментария не может составлять больше 140 символов');

const formValidateHandler = () => {
  if (pristine.validate()) {
    submitBtnElement.disabled = false;
  } else {
    submitBtnElement.disabled = true;
  }
};

const btnClickHandler = () => closeEditingWindow();

const btnKeydownHandler = (evt) => {
  if (isEscKey(evt) && (evt.target !== hashtagsInputElement && evt.target !== descriptionInputElement)) {
    closeEditingWindow();
  }
};

const openEditingWindow = () => {
  const img = loadImgBtnElement.files[0];
  const imgName = img.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => imgName.endsWith(it));

  if (matches) {
    preview.src = URL.createObjectURL(img);
  }

  editingWindowElement.classList.remove('hidden');
  body.classList.add('modal-open');

  closeBtnElement.addEventListener('click', btnClickHandler);
  document.addEventListener('keydown', btnKeydownHandler);
  hashtagsInputElement.addEventListener('input', formValidateHandler);
  descriptionInputElement.addEventListener('input', formValidateHandler);

  addEventListenerImage();
  addFilter();
};

loadImgBtnElement.addEventListener('input', openEditingWindow);

function closeEditingWindow() {
  editingWindowElement.classList.add('hidden');
  body.classList.remove('modal-open');

  closeBtnElement.removeEventListener('click', btnClickHandler);
  document.removeEventListener('keydown', btnKeydownHandler);
  hashtagsInputElement.removeEventListener('input', formValidateHandler);
  descriptionInputElement.removeEventListener('input', formValidateHandler);

  removeEventListenerImage();
  removeFilters();

  scaleValueElement.value = '100%';
  hashtagsInputElement.value = '';
  descriptionInputElement.value = '';
  loadImgBtnElement.value = '';
}

const blockSubmitBtn = () => {
  submitBtnElement.disabled = true;
  submitBtnElement.textContent = 'Публикую...';
};

const unblockSubmitBtn = () => {
  submitBtnElement.disabled = false;
  submitBtnElement.textContent = 'Опубликовать';
};

const outOfFormHandler = (evt) => {
  if (evt.target === successFormTemplate && evt.target !== successFormTemplate.querySelector('.success__inner')) {
    hideSuccessForm();
  }
  if (evt.target === errorFormTemplate && evt.target !== errorFormTemplate.querySelector('.error__inner')) {
    hideErrorForm();
  }
};

const successKeydownHandler = (evt) => {
  if (isEscKey(evt)) {
    evt.preventDefault();
    hideSuccessForm();
  }
};

const errorKeydownHandler = (evt) => {
  if (isEscKey(evt)) {
    evt.preventDefault();
    hideErrorForm();
  }
};

const successBtnHandler = () => hideSuccessForm();

const errorBtnHandler = () => hideErrorForm();

function hideSuccessForm() {
  document.removeEventListener('click', outOfFormHandler);
  document.removeEventListener('keydown', successKeydownHandler);
  body.removeChild(successFormTemplate);
  successBtnElement.removeEventListener('click', successBtnHandler);
}

function hideErrorForm() {
  editingWindowElement.classList.remove('hidden');
  body.removeChild(errorFormTemplate);
  errorBtnElement.removeEventListener('click', errorBtnHandler);
  document.removeEventListener('click', outOfFormHandler);
  document.removeEventListener('keydown', errorKeydownHandler);
}

const showSuccessForm = () => {
  successBtnElement.addEventListener('click', successBtnHandler);
  body.appendChild(successFormTemplate);
  document.addEventListener('click', outOfFormHandler);
  document.addEventListener('keydown', successKeydownHandler);
};

const showErrorForm = (message) => {
  editingWindowElement.classList.add('hidden');
  errorBtnElement.textContent = 'Попробовать ещё раз';
  errorFormTemplate.querySelector('.error__title').textContent = message;
  errorBtnElement.addEventListener('click', errorBtnHandler);
  body.appendChild(errorFormTemplate);
  document.addEventListener('click', outOfFormHandler);
  document.addEventListener('keydown', errorKeydownHandler);
};

const setUserFormSubmit = (onSuccess) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    blockSubmitBtn();

    sendDataToServer(
      () => {
        onSuccess();
        unblockSubmitBtn();
        showSuccessForm();
      },
      (message) => {
        showErrorForm(message);
        unblockSubmitBtn();
      },
      new FormData(evt.target),
    );
  });
};

export { setUserFormSubmit, closeEditingWindow };
