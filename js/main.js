import { getDataFromServer } from './api.js';
import { renderPhotos, filterBtnsAddEvent, showAlert, TIMEOUT_DELAY } from './rendering-photos.js';
import { debounce} from './utils.js';

getDataFromServer(
  (photos) => {
    renderPhotos(photos);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    filterBtnsAddEvent(debounce(() => renderPhotos(photos), TIMEOUT_DELAY));
  },
  (message) => showAlert(message),
);
