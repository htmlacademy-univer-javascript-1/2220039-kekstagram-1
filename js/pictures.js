import { openBigPicture } from './big-picture.js';

const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const fragment = document.createDocumentFragment();

const renderPhoto = (photo) => {
  const element = pictureTemplate.cloneNode(true);
  element.querySelector('.picture__img').src = photo.url;
  element.querySelector('.picture__likes').textContent = photo.likes;
  element.querySelector('.picture__comments').textContent = photo.comments.length;

  element.addEventListener('click', (evt) => {
    evt.preventDefault();

    openBigPicture(photo);
  });

  return element;
};

const renderPhotos = (photos) => {
  photos.forEach((photo) => {
    fragment.appendChild(renderPhoto(photo));
  });

  document.querySelector('.pictures').appendChild(fragment);
};

export { renderPhotos };
