const NAMES = ['София Ротару', 'Beyonce', 'Marge Simpson', 'Набзделла Яичная', 'Профитроля Глушко', 'Свистина Шапокляк', 'Megan Thee-Stallion', 'Sakura Petals', 'Voices Of-The-Chord'];
const MESSAGES = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
const DESCRIPTIONS = ['Женщина на фото', 'София Ротару трибьют шоу', 'Marge attacks Beyonce'];
const CountLike = {
  MIN: 15,
  MAX: 200
};
const AvatarNumber = {
  MIN: 1,
  MAX: 6
};
const getRandomPositiveInteger = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};
const checkStringLength = (string, length) => {
  return string.length <= length;
};
checkStringLength('sdfsdf', 4);
const createComment = (id) => ({
  id,
  avatar: `img/avatar-${getRandomPositiveInteger(AvatarNumber.MIN, AvatarNumber.MAX)}.svg`,
  message: MESSAGES[getRandomPositiveInteger(0, MESSAGES.length - 1)],
  name: NAMES[getRandomPositiveInteger(0, NAMES.length - 1)],
});
const createCommentsArray = () => {
  let COMMENTS = Array.from({
    length: 3
  });
  return COMMENTS.map((element, index) => element = createComment(index + 1));
};
const createPhotoData = (id) => ({
  id,
  url: `photos/${id}.jpg`,
  desription: DESCRIPTIONS[0, DESCRIPTIONS.length - 1],
  likes: getRandomPositiveInteger(CountLike.MIN, CountLike.MAX),
  comments: createCommentsArray(),
});
const createPhotosArray = () => {
  let PHOTOS = Array.from({
    length: 25
  });
  return PHOTOS.map((element, index) => element = createPhotoData(index + 1))
};
createPhotosArray();
