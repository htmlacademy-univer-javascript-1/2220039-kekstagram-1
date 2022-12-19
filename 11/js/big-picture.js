import { createComment } from './comments.js';
import { isEscKey, numberDeclination } from './utils.js';

const COMMENTS_STEP = 5;

const bigPicture = document.querySelector('.big-picture');
const commentCounter = document.querySelector('.social__comment-count');
const commentLoader = document.querySelector('.comments-loader');
const closingBtn = bigPicture.querySelector('.big-picture__cancel');
const commentTemplate = bigPicture.querySelector('.social__comment');
const comments = bigPicture.querySelector('.social__comments');

let currentIndex = COMMENTS_STEP;
let currentComments = [];

const addComments = () => {
  comments.innerHTML = '';

  currentIndex = (currentIndex > currentComments.length) ? currentComments.length : currentIndex;

  const commentsSelected = currentComments.slice(0, currentIndex);

  if (currentComments.length <= COMMENTS_STEP || currentIndex >= currentComments.length) {
    commentLoader.classList.add('hidden');
  }
  else {
    commentLoader.classList.remove('hidden');
  }

  const commentsDeclination = numberDeclination(currentComments.length, 'комментария', 'комментариев', 'комментариев');
  commentCounter.textContent = `${currentIndex} из ${currentComments.length} ${commentsDeclination}`;

  commentsSelected.forEach((comment) => {
    comments.appendChild(createComment(comment, commentTemplate));
  });
};

const onCommentLoaderClick = () => {
  currentIndex += COMMENTS_STEP;
  addComments();
};

const closePicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');

  currentComments = [];
  currentIndex = COMMENTS_STEP;
  commentLoader.removeEventListener('click', onCommentLoaderClick);
};

const onDocumentEscKeyDown = (evt) => {
  if (isEscKey(evt)) {
    closePicture();
  }
};

const onClosingBtnClick = () => {
  closePicture();
  closingBtn.removeEventListener('click', onClosingBtnClick);
};

const openBigPicture = (picture) => {
  document.body.classList.add('modal-open');
  bigPicture.classList.remove('hidden');
  commentCounter.classList.remove('hidden');
  commentLoader.classList.remove('hidden');

  bigPicture.querySelector('.big-picture__img').querySelector('img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  currentComments = picture.comments;

  addComments();

  commentLoader.addEventListener('click', onCommentLoaderClick);
  document.addEventListener('keydown', onDocumentEscKeyDown);
  closingBtn.addEventListener('click', onClosingBtnClick);
};

export { openBigPicture };
