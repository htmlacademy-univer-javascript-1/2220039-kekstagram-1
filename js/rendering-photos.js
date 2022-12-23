import { renderPhotosList } from './big-picture.js';
import { getRandomPositiveInteger} from './utils.js';
import { closeEditingWindow,  setUserFormSubmit  } from './form.js';

const ALERT_SHOW_TIME = 5000;
const TIMEOUT_DELAY = 500;
const RANDOM_PHOTOS_COUNT = 10;
let selectedFilter = 'filter-default';

const filterBtns = document.body.querySelectorAll('.img-filters__button');

const sortingCommentsCount = (photoA, photoB) => photoB.comments.length - photoA.comments.length;

const filteringPhotos = (photos) => {
  let photosForRendering = [];
  let temporaryPhotoStorage = [];
  switch (selectedFilter) {
    case 'filter-discussed':
      photosForRendering = photos.slice().sort(sortingCommentsCount);
      break;

    case 'filter-random':
      temporaryPhotoStorage = photos.slice();
      for (let i = 0; i < RANDOM_PHOTOS_COUNT && temporaryPhotoStorage.length > 0; i++) {
        const randomPhotoIndex = getRandomPositiveInteger(0, temporaryPhotoStorage.length - 1);
        photosForRendering.push(temporaryPhotoStorage[randomPhotoIndex]);
        temporaryPhotoStorage.splice(randomPhotoIndex, 1);
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

const filterBtnsAddEvent = (cb) => {
  filterBtns.forEach((filterBtn) => {
    filterBtn.addEventListener('click', (evt) => {
      selectedFilter = evt.target.id;
      filterBtns.forEach((button) => button.classList.remove('img-filters__button--active'));
      evt.target.classList.add('img-filters__button--active');
      cb();
    });
  });
};
setUserFormSubmit(closeEditingWindow);

export{ renderPhotos, filterBtnsAddEvent, showAlert, TIMEOUT_DELAY };
