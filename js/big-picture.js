import { isEscKey } from './utils.js';

const MAX_COMMENTS_COUNT = 5;

const bigPictureWindowElement = document.querySelector('.big-picture');
const commentTemplate = bigPictureWindowElement.querySelector('#comment').content.querySelector('.social__comment');
const closeBtnElement = bigPictureWindowElement.querySelector('.big-picture__cancel');
const commentsContainerElement = bigPictureWindowElement.querySelector('.social__comments');
const loaderCommentsBtnElement = bigPictureWindowElement.querySelector('.comments-loader');
const shownCommentsCount = bigPictureWindowElement.querySelector('.shown-comments-count');
const picturesContainerElement = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('a');

let commentsCounter;
let allComments;

const appendNewComments = ({ avatar, name, message }) => {
  const newComment = commentTemplate.cloneNode(true);
  newComment.querySelector('.social__picture').src = avatar;
  newComment.querySelector('.social__picture').alt = name;
  newComment.querySelector('.social__text').textContent = message;
  return newComment;
};

const updateCommentsCount = (value) => {
  shownCommentsCount.textContent = value;
};

const loadNewComments = () => {
  let addingCounter = MAX_COMMENTS_COUNT;
  if (allComments.length > commentsCounter) {
    if ((allComments.length - commentsCounter) <= MAX_COMMENTS_COUNT) {
      addingCounter = allComments.length - commentsCounter;
      loaderCommentsBtnElement.classList.add('hidden');
    }
    const fragment = document.createDocumentFragment();
    allComments.slice(commentsCounter, commentsCounter + addingCounter).forEach((comment) => fragment.appendChild(appendNewComments(comment)));
    commentsContainerElement.appendChild(fragment);
    commentsCounter += addingCounter;
    updateCommentsCount(commentsCounter);
  }
};

const btnClickHandler = () => closeBigPictureWindow();

const btnKeydownHandler = (evt) => {
  if (isEscKey(evt)) {
    closeBigPictureWindow();
  }
};

function closeBigPictureWindow() {
  document.removeEventListener('keydown', btnKeydownHandler);
  closeBtnElement.removeEventListener('click', btnClickHandler);
  bigPictureWindowElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  loaderCommentsBtnElement.removeEventListener('click', loadNewComments);
}

const openBigPictureWindow = ({ url, description, likes, comments }) => {
  bigPictureWindowElement.querySelector('.big-picture__img').querySelector('img').setAttribute('src', url);
  bigPictureWindowElement.querySelector('.likes-count').textContent = likes;
  bigPictureWindowElement.querySelector('.comments-count').textContent = comments.length;
  bigPictureWindowElement.querySelector('.social__caption').textContent = description;
  loaderCommentsBtnElement.classList.remove('hidden');

  commentsContainerElement.innerHTML = '';
  allComments = comments;
  commentsCounter = 0;
  loadNewComments();

  bigPictureWindowElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeBtnElement.addEventListener('click', btnClickHandler);
  document.addEventListener('keydown', btnKeydownHandler);
  loaderCommentsBtnElement.addEventListener('click', loadNewComments);
};

const renderPhotosList = (photosList) => {
  const photosListFragment = document.createDocumentFragment();

  photosList.forEach(({ url, likes, comments, description }) => {
    const photoElement = pictureTemplate.cloneNode(true);
    photoElement.querySelector('img').setAttribute('src', url);
    photoElement.querySelector('.picture__likes').textContent = likes;
    photoElement.querySelector('.picture__comments').textContent = comments.length;
    photoElement.querySelector('img').addEventListener('click', () => {
      openBigPictureWindow({ url, likes, comments, description });
    });
    photosListFragment.append(photoElement);
  });

  picturesContainerElement.append(photosListFragment);
};

export { renderPhotosList };
