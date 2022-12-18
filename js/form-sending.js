import { sendRequest } from './fetch.js';
import { closeUploadPopup } from './form.js';
import { isEscKey } from './utils.js';
import { onDocumentEscKeyDown } from './form.js';

const MESSAGE_Z_INDEX = 100;

const form = document.querySelector('.img-upload__form');
const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

let message;

const closeMessage = () => {
  message.classList.add('hidden');
};

const onErrorEscKeyDown = (evt) => {
  if (isEscKey(evt)) {
    closeMessage();
    document.addEventListener('keydown', onDocumentEscKeyDown);
    document.removeEventListener('keydown', onErrorEscKeyDown);
  }
};

const showMessage = (isSuccessful) => {
  if (isSuccessful) {
    message = successTemplate.cloneNode(true);
  }
  else {
    message = errorTemplate.cloneNode(true);
    document.removeEventListener('keydown', onDocumentEscKeyDown);
    document.addEventListener('keydown', onErrorEscKeyDown);
  }

  message.style.zIndex = MESSAGE_Z_INDEX;
  message.classList.remove('hidden');

  document.body.appendChild(message);
};

const closeSendingForm = () => {
  closeMessage();
  closeUploadPopup();
};

const onSuccessBtnClicked = () => closeSendingForm();

const onErrorBtnClicked = () => closeMessage();

const onSuccess = () => {
  showMessage(true);
  message.addEventListener('click', onSuccessBtnClicked);
};

const onFail = () => {
  showMessage(false);
  message.addEventListener('click', onErrorBtnClicked);
};

const onFormEscKeyDown = (evt) => {
  if (isEscKey(evt)) {
    closeMessage();

    if (message.classList.contains('success')) {
      closeUploadPopup();
    }

    form.removeEventListener('keydown', onFormEscKeyDown);
  }
};

const sendData = () => sendRequest(onSuccess, onFail, 'POST', new FormData(form));

form.addEventListener('keydown', onFormEscKeyDown);

export { sendData };
