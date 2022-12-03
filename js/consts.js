const NAMES = [
  'София Ротару',
  'Beyonce',
  'Marge Simpson',
  'Набзделла Яичная',
  'Профитроля Глушко',
  'Свистина Шапокляк',
  'Megan Thee-Stallion',
  'Sakura Petals',
  'Voices Of-The-Chord'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const DESCRIPTIONS = [
  'Женщина на фото',
  'София Ротару трибьют шоу',
  'Marge attacks Beyonce'
];


const CountLike = {
  MIN: 15,
  MAX: 200
};

const AvatarNumber = {
  MIN: 1,
  MAX: 6
};

const CountComment = {
  MIN: 0,
  MAX: 23
};

const RENDERED_COMMENTS_COUNT = 5;
const MAX_COUNT_PHOTOS = 25;
const STEP_ADDED_COMMENTS = 5;
const MAX_STRING_LENGTH = 140;
const MAX_HASHTAG_COUNT = 5;
const MAX_HASHTAG_LENGTH = 20;
const SHOWN_COMMENTS_COUNT = 25;

const ErrorMessage = {
  SEPARETED_BY_SPASES: 'Хэш-теги должны разделяться пробелами',
  START_WITH: 'Хэш-тег должен начинаться с символа #',
  NO_REPEAT: 'Хэш-теги не должны повторяться',
  HASHTAG_MAX_LENTH: `Максимальная длина одного хэш-тега ${MAX_HASHTAG_LENGTH} символов, включая #`,
  MAX_COUNT_HASHTAG: `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов`,
  UNACCEPTABLE_SYMBOLS: 'Хэш-тег содержит недопустимые символы',
  COMMENT_MAX_LENGTH: `Максимальная длина комментария ${MAX_STRING_LENGTH} символов`
};

export { NAMES, MESSAGES, DESCRIPTIONS, CountLike, AvatarNumber, RENDERED_COMMENTS_COUNT, CountComment,
  MAX_COUNT_PHOTOS, STEP_ADDED_COMMENTS, MAX_STRING_LENGTH, MAX_HASHTAG_COUNT,MAX_HASHTAG_LENGTH, ErrorMessage, SHOWN_COMMENTS_COUNT };
