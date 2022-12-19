import { isEscapeKey } from './util.js';

const MAX_COMMENTS_COUNT = 5;
let commentsCounter;
let allComments;

const bigPictureWindowElement = document.querySelector('.big-picture');
const commentTemplate = bigPictureWindowElement.querySelector('#comment').content.querySelector('.social__comment');
const closeButtonElement = bigPictureWindowElement.querySelector('.big-picture__cancel');
const commentsContainerElement = bigPictureWindowElement.querySelector('.social__comments');
const loaderСommentsButtonElement = bigPictureWindowElement.querySelector('.comments-loader');
const shownCommentsCount = bigPictureWindowElement.querySelector('.shown-comments-count');

const appendNewComments = ({avatar, name, message}) => {
  const newComment = commentTemplate.cloneNode(true);
  newComment.querySelector('.social__picture').src = avatar;
  newComment.querySelector('.social__picture').alt = name;
  newComment.querySelector('.social__text').textContent = message;
  return newComment;
};

function updateCommentsCount (value) {
  shownCommentsCount.textContent = value;
}

const loadNewComments = () => {
  let addingCounter = MAX_COMMENTS_COUNT;
  if (allComments.length > commentsCounter) {
    if ((allComments.length - commentsCounter) <= MAX_COMMENTS_COUNT) {
      addingCounter = allComments.length - commentsCounter;
      loaderСommentsButtonElement.classList.add('hidden');
    }
    const fragment = document.createDocumentFragment();
    allComments.slice(commentsCounter, commentsCounter + addingCounter).forEach((comment) => fragment.appendChild(appendNewComments(comment)));
    commentsContainerElement.appendChild(fragment);
    commentsCounter += addingCounter;
    updateCommentsCount(commentsCounter);
  }
};

const buttonClickHandler = () => closeBigPictureWindow();

const buttonKeydownHandler = (evt) => {
  if (isEscapeKey(evt)) {
    closeBigPictureWindow();
  }
};

function closeBigPictureWindow () {
  document.removeEventListener('keydown', buttonKeydownHandler);
  closeButtonElement.removeEventListener('click', buttonClickHandler);
  bigPictureWindowElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  loaderСommentsButtonElement.removeEventListener('click',  loadNewComments);
}

const openBigPictureWindow = ({url, description, likes, comments}) => {
  bigPictureWindowElement.querySelector('.big-picture__img').querySelector('img').setAttribute('src', url);
  bigPictureWindowElement.querySelector('.likes-count').textContent = likes;
  bigPictureWindowElement.querySelector('.comments-count').textContent = comments.length;
  bigPictureWindowElement.querySelector('.social__caption').textContent = description;
  loaderСommentsButtonElement.classList.remove('hidden');

  commentsContainerElement.innerHTML = '';
  allComments = comments;
  commentsCounter = 0;
  loadNewComments();

  bigPictureWindowElement.classList.remove('hidden');
  document.body.classList.add('modal-open');

  closeButtonElement.addEventListener('click',  buttonClickHandler);
  document.addEventListener('keydown', buttonKeydownHandler);
  loaderСommentsButtonElement.addEventListener('click',  loadNewComments);
};

export {openBigPictureWindow};
