const Urls = {
  GET: 'https://26.javascript.pages.academy/kekstagram/data',
  POST: 'https://26.javascript.pages.academy/kekstagram',
};

const getDataFromServer = (onSuccess, onFail) => {
  fetch(Urls.GET)
    .then((response) => response.json())
    .then((photos) => onSuccess(photos))
    .catch(() => onFail('При загрузке данных с сервера произошла ошибка'));
};

const sendDataToServer = (onSuccess, onFail, body) => {
  fetch(Urls.POST,
    {
      method: 'POST',
      body,
    }
  ).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      onFail('Не удалось опубликовать');
    }
  })
    .catch(() => onFail('Не удалось опубликовать'));
};

export {getDataFromServer, sendDataToServer};
