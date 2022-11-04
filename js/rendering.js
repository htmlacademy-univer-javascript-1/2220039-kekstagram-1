const pictures = document.querySelector('.pictures');
const template = document.querySelector('#picture').content;
const documentFragment = document.createDocumentFragment();

const rendering = (photos) => {
  for (const photo of photos) {
    const picture = template.cloneNode(true);
    picture.querySelector('.picture__img').src = photo.url;
    picture.querySelector('.picture__likes').textContent = photo.likes;
    picture.querySelector('.picture__comments').textContent = photo.comments.length;
    documentFragment.append(picture);
  }
  pictures.append(documentFragment);
};

export {rendering};
