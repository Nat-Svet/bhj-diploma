/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';//задаем url для класса account
  /**
   * Получает информацию о счёте
   * */
  static get(id = '', callback){
if (!id) {
      callback(new Error('ID не передан'));
      return;
    }
    const url = `${this.URL}/${encodeURIComponent(id)}`;//формируем url с id
    this.createRequest({//вызываем функцию createRequest для отправки запроса
      method: 'GET',
      url,
      callback
    });
  }
  }

