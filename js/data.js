import { getRandomPositiveInteger } from './util.js';
import { NAMES, MESSAGES, DESCRIPTIONS } from './mocks.js';
import { CountLike, AvatarNumber, MAX_COUNT_PHOTOS } from './consts.js';


const createComment = (id) => ({
  id,
  avatar: `img/avatar-${getRandomPositiveInteger(AvatarNumber.MIN, AvatarNumber.MAX)}.svg`,
  message: MESSAGES[getRandomPositiveInteger(0, MESSAGES.length - 1)],
  name: NAMES[getRandomPositiveInteger(0, NAMES.length - 1)],
});
const createCommentsArray = () => {
  const comments = Array.from({
    length: 3
  });
  return comments.map((element, index) => createComment(index + 1));
};
const createPhotoData = (id) => ({
  id,
  url: `photos/${id}.jpg`,
  desription: DESCRIPTIONS[0, DESCRIPTIONS.length - 1],
  likes: getRandomPositiveInteger(CountLike.MIN, CountLike.MAX),
  comments: createCommentsArray(),
});
const createPhotosArray = () => {
  const photos = Array.from({
    length: MAX_COUNT_PHOTOS
  });
  return photos.map((element, index) => createPhotoData(index + 1));
};

export {createPhotosArray};
