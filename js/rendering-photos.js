import { renderPhotosList } from './generate-mini.js';
import { getDataFromServer } from './api.js';
import { getRandomNumber, debounce } from './util.js';
import { setUserFormSubmit, closeEditingWindow } from './form.js';

const ALERT_SHOW_TIME = 5000;
const TIMEOUT_DELAY = 500;
const RANDOM_PHOTOS_COUNT = 10;
let selectedFilter = 'filter-default';

const filterButtons = document.body.querySelectorAll('.img-filters__button');

const sortingCommentsCount = (photoA, photoB) => photoB.comments.length - photoA.comments.length;

const filteringPhotos = (photos) => {
  let photosForRendering = [];
  let temporaryStorage = [];
  switch (selectedFilter) {
    case 'filter-discussed':
      photosForRendering = photos.slice().sort(sortingCommentsCount);
      break;

    case 'filter-random':
      temporaryStorage = photos.slice();
      for (let i = 0; i < RANDOM_PHOTOS_COUNT && temporaryStorage.length > 0; i++) {
        const randomPhotoIndex = getRandomNumber(0, temporaryStorage.length - 1);
        photosForRendering.push(temporaryStorage[randomPhotoIndex]);
        temporaryStorage.splice(randomPhotoIndex, 1);
      }
      break;

    default:
      photosForRendering = photos;
      break;
  }
  return photosForRendering;
};

const renderPhotos = (photos) => {
  const filteredPhotos = filteringPhotos(photos);
  document.querySelectorAll('.picture').forEach((photo) => photo.remove());
  renderPhotosList(filteredPhotos);
};

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '20px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

const filterButtonsAddEvent = (cb) => {
  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener('click', (evt) => {
      selectedFilter = evt.target.id;
      filterButtons.forEach((button) => button.classList.remove('img-filters__button--active'));
      evt.target.classList.add('img-filters__button--active');
      cb();
    });
  });
};

getDataFromServer(
  (photos) => {
    renderPhotos(photos);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    filterButtonsAddEvent(debounce(() => renderPhotos(photos), TIMEOUT_DELAY));
  },
  (message) => showAlert(message),
);

setUserFormSubmit(closeEditingWindow);
