/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  static entityType = '';
  static url = '';
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */

  static list(data, callback) {
    const xhr = new XMLHttpRequest(); //создаем новый запрос
    const url = `/api/${this.entityType}`;//формируем URL

    xhr.open('GET', url);//открываем запрос
    xhr.responseType = 'json';//ожидаем получить ответ в формате json


    //обработчик ответа
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {//ответ успешный
        callback(null, xhr.response);//callback без ошибки с ответом
      } else {//если ошибка, создаем объект ошибки
        const err = new Error(`Ошибка HTTP: ${xhr.status}`);// с сообщением о статусе
        err.status = xhr.status; //добавляем статус в ошибку
        err.response = xhr.response;//добавляем тело ответа
        callback(err);//вызваем callback с ошибкой
      }
    };
    //обработчик ошибки сети
    xhr.onerror = () => {
      callback(new Error('Ошибка сети или CORS'));
    };
    //отправляем запрос
    xhr.send();
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    const xhr = new XMLHttpRequest();//создаем запрос
    const url = `/api/${this.entityType}`;//формируем URL

    xhr.open('POST', url);//открываем запрос
    xhr.responseType = 'json';//указываем, что ответ  в формате json

    xhr.setRequestHeader('Content-Type', 'application/json');//устанавливаем заголовок

    //обработчик ответа
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {//если ответ успешный
        callback(null, xhr.response);//callback без ошибки с ответом
      } else {//если ошибка
        const err = new Error(`Ошибка HTTP: ${xhr.status}`);//если ошибка, создаем объект ошибки
        err.status = xhr.status;//добавляем статус в ошибку
        err.response = xhr.response;//добавляем тело ответа
        callback(err);//вызываем callback  с ошибкой
      }
    };
    //обработчик ошибки сети
    xhr.onerror = () => {
      callback(new Error('Ошибка сети или CORS'));
    };

    xhr.send(JSON.stringify(data));//отправляем данные в виде json строки
  }


  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback) {
    if (!data.id) {//проверяем, что передан id
      callback(new Error('ID не передан'));
      return;//без id удаление не возможно
    }

    const xhr = new XMLHttpRequest();//создаем запрос
    const url = `/api/${this.entityType}/${encodeURIComponent(data.id)}`;//формируем URL с id

    xhr.open('DELETE', url);//открываем запрос
    xhr.responseType = 'json';//указываем, что ответ  в формате json 

    //обработчик ответа
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        callback(null, xhr.response);
      } else {
        const err = new Error(`Ошибка HTTP: ${xhr.status}`);
        err.status = xhr.status;
        err.response = xhr.response;
        callback(err);
      }
    };
    //обработчик ошибок сети
    xhr.onerror = () => {
      callback(new Error('Ошибка сети или CORS'));
    };

    xhr.send();//отправляем запрос
  }
}

