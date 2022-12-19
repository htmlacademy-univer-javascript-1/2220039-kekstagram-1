import { isEscapeKey, checkForRepeats } from './util.js';
import { form, addEventListenerImage, removeEventListenerImage, addFilter, removeFilters, scaleValueElement } from './effects.js';
import { sendDataToServer } from './api.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const MAX_LENGTH_COMMENT = 140;
const MAX_LENGTH_HASHTAG = 20;
const MAX_HASHTAGS_COUNT = 5;
let messageHashtagError = '';

const HashtagsRules = {
  HASHTAG_SYMBOL: 'Хэш-тег начинается с символа # (решётка).',
  VALID_CHARACTERS: 'Cтрока после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д..',
  ONLY_HASHTAG: 'Хеш-тег не может состоять только из одной решётки.',
  MAX_LENGTH: 'Максимальная длина одного хэш-тега 20 символов, включая решётку.',
  NO_REPEAT: 'Один и тот же хэш-тег не может быть использован дважды.',
  MAX_COUNT: 'Нельзя указать больше пяти хэш-тегов.',
  OKAY: ''
};

const re = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;

const body = document.querySelector('body');
const loadImgButtonElement = form.querySelector('#upload-file');
const editingWindowElement = form.querySelector('.img-upload__overlay');
const closeButtonElement = editingWindowElement.querySelector('#upload-cancel');
const submitButtonElement = form.querySelector('.img-upload__submit');
const hashtagsInputElement = form.querySelector('input[name="hashtags"]');
const descriptionInputElement = form.querySelector('textarea[name="description"]');
const preview = document.querySelector('.img-upload__preview img');

const successFormTemplate = document.querySelector('#success').content.querySelector('.success');
const errorFormTemplate = document.querySelector('#error').content.querySelector('.error');
const errorButtonElement = errorFormTemplate.querySelector('.error__button');
const successButtonElement = successFormTemplate.querySelector('.success__button');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'img-upload__error'
}, true);

const validateHashtag = (value) => {
  messageHashtagError = HashtagsRules.OKAY;
  value = value.trim().toLowerCase();
  const hashtags = value.split(' ');
  if (hashtags[0] !== '') {
    for (const hashtag of hashtags) {
      if (!re.test(hashtag)) {
        if (hashtag[0] !== '#') {
          messageHashtagError = HashtagsRules.HASHTAG_SYMBOL;
          return false;
        }
        if (hashtag.length === 1 && hashtag[0] === '#') {
          messageHashtagError = HashtagsRules.ONLY_HASHTAG;
          return false;
        }
        if (hashtag.length > MAX_LENGTH_HASHTAG) {
          messageHashtagError = HashtagsRules.MAX_LENGTH;
          return false;
        }
        messageHashtagError = HashtagsRules.VALID_CHARACTERS;
        return false;
      }
    }
    if (hashtags.length > MAX_HASHTAGS_COUNT) {
      messageHashtagError = HashtagsRules.MAX_COUNT;
      return false;
    }
    if (checkForRepeats(hashtags)) {
      messageHashtagError = HashtagsRules.NO_REPEAT;
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
    submitButtonElement.disabled = false;
  } else {
    submitButtonElement.disabled = true;
  }
};

const buttonClickHandler = () => closeEditingWindow();

const buttonKeydownHandler = (evt) => {
  if (isEscapeKey(evt) && (evt.target !== hashtagsInputElement && evt.target !== descriptionInputElement)) {
    closeEditingWindow();
  }
};

const openEditingWindow = () => {
  const img = loadImgButtonElement.files[0];
  const imgName = img.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => imgName.endsWith(it));

  if (matches) {
    preview.src = URL.createObjectURL(img);
  }

  editingWindowElement.classList.remove('hidden');
  body.classList.add('modal-open');

  closeButtonElement.addEventListener('click', buttonClickHandler);
  document.addEventListener('keydown', buttonKeydownHandler);
  hashtagsInputElement.addEventListener('input', formValidateHandler);
  descriptionInputElement.addEventListener('input', formValidateHandler);

  addEventListenerImage();
  addFilter();
};

loadImgButtonElement.addEventListener('input', openEditingWindow);

function closeEditingWindow () {
  editingWindowElement.classList.add('hidden');
  body.classList.remove('modal-open');

  closeButtonElement.removeEventListener('click', buttonClickHandler);
  document.removeEventListener('keydown', buttonKeydownHandler);
  hashtagsInputElement.removeEventListener('input', formValidateHandler);
  descriptionInputElement.removeEventListener('input', formValidateHandler);

  removeEventListenerImage();
  removeFilters();

  scaleValueElement.value = '100%';
  hashtagsInputElement.value = '';
  descriptionInputElement.value = '';
  loadImgButtonElement.value = '';
}

const blockSubmitButton = () => {
  submitButtonElement.disabled = true;
  submitButtonElement.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButtonElement.disabled = false;
  submitButtonElement.textContent = 'Опубликовать';
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
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideSuccessForm();
  }
};

const errorKeydownHandler = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideErrorForm();
  }
};

const successButtonHandler = () => hideSuccessForm();

const errorButtonHandler = () => hideErrorForm();

function hideSuccessForm () {
  document.removeEventListener('click', outOfFormHandler);
  document.removeEventListener('keydown', successKeydownHandler);
  body.removeChild(successFormTemplate);
  successButtonElement.removeEventListener('click', successButtonHandler);
}

function hideErrorForm () {
  editingWindowElement.classList.remove('hidden');
  body.removeChild(errorFormTemplate);
  errorButtonElement.removeEventListener('click', errorButtonHandler);
  document.removeEventListener('click', outOfFormHandler);
  document.removeEventListener('keydown', errorKeydownHandler);
}

const showSuccessForm = () => {
  successButtonElement.addEventListener('click', successButtonHandler);
  body.appendChild(successFormTemplate);
  document.addEventListener('click', outOfFormHandler);
  document.addEventListener('keydown', successKeydownHandler);
};

const showErrorForm = (message) => {
  editingWindowElement.classList.add('hidden');
  errorButtonElement.textContent = 'Попробовать ещё раз';
  errorFormTemplate.querySelector('.error__title').textContent = message;
  errorButtonElement.addEventListener('click', errorButtonHandler);
  body.appendChild(errorFormTemplate);
  document.addEventListener('click', outOfFormHandler);
  document.addEventListener('keydown', errorKeydownHandler);
};

const setUserFormSubmit = (onSuccess) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    blockSubmitButton();

    sendDataToServer(
      () => {
        onSuccess();
        unblockSubmitButton();
        showSuccessForm();
      },
      (message) => {
        showErrorForm(message);
        unblockSubmitButton();
      },
      new FormData(evt.target),
    );
  });
};

export {setUserFormSubmit, closeEditingWindow};
