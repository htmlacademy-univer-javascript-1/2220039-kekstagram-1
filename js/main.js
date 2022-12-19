import { renderPhotos } from './pictures.js';
import { sendRequest } from './fetch.js';
import { onFail } from './utils.js';
import './big-picture.js';
import './form.js';
import './form-validation.js';
import './effects.js';
import './scale.js';

let photos = [];

const onSuccess = (data) => {
  photos = data.slice();
  renderPhotos(photos);
};

sendRequest(onSuccess, onFail, 'GET');
