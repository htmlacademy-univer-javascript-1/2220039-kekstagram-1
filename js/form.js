import { onFormInput, resetForm } from './form-validation.js';
import { isEscKey as isEscKey } from './utils.js';
import { setDefaultScale } from './scale.js';
import { setDefaultEffect } from './effects.js';


const imgUploadField = document.querySelector('#upload-file');
const form = document.querySelector('.img-upload__form');
const editImg = document.querySelector('.img-upload__overlay');
const closeBtn = form.querySelector('.img-upload__cancel');


const closeUploadPopup = () => {
  editImg.classList.add('hidden');
  document.body.classList.remove('modal-open');

  imgUploadField.value = '';
  form.querySelector('.text__hashtags').value = '';
  form.querySelector('.text__description').value = '';
  resetForm();

  form.removeEventListener('submit', onFormInput);
};

const onCloseClick = () => {
  closeUploadPopup();
  closeBtn.removeEventListener('click', onCloseClick);
};

const onClosingBtnClick = () => onCloseClick();

const isNotTarget = (evt) => !evt.target.classList.contains('text__hashtags')
  && !evt.target.classList.contains('text__description');

const onDocumentEscKeyDown = (evt) => {
  if (isEscKey(evt) && isNotTarget(evt)) {
    onCloseClick();
    document.removeEventListener('keydown', onDocumentEscKeyDown);
  }
};

const onUploadingFieldInput = () => {
  editImg.classList.remove('hidden');
  document.body.classList.add('modal-open');
  closeBtn.addEventListener('click', onClosingBtnClick);
  document.addEventListener('keydown', onDocumentEscKeyDown);
  form.addEventListener('submit', onFormInput);

  setDefaultScale();
  setDefaultEffect();
};

imgUploadField.addEventListener('input', onUploadingFieldInput);

export { closeUploadPopup, onDocumentEscKeyDown };
