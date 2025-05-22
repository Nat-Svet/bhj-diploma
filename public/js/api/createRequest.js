/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {

    //деструктуризация options, чтобы получить доступ ко всем параметрам
    const {
        url = '',//строка адреса запроса, по умолчанию пустая
        method = 'GET',//метод, по умолчанию GET 
        data = {}, // объект с данными для отправки, по умолчанию пустой
        callback = () => { }, // функция callback, по умолчанию пустая (дальше в ней будет либо err, либо response)
    } = options;

    //если адреса нет, callback выдает ошибку, выходим из функции
    if (!url) {
        callback(new Error('Не указан URL'));
        return;
    }

    //поймать возможные исключения
    try {
        //создаем запрос
        const xhr = new XMLHttpRequest();
        //инициализируем запрос
        xhr.open(method.toUpperCase(), url);// название метода переводим в верхний регистр
        // Указываем, что ожидаем ответ в формате JSON
        xhr.responseType = 'json';
        // Формируем тело запроса через FormData
        const formData = new FormData();
        for (const key in data) { //перебираем все свойства объекта data
            if (data.hasOwnProperty(key)) {//учитываем только собственные свойства объекта
                formData.append(key, data[key]);//добавляем пару ключ - значение в FormData
            }
        }

        //ответ получен
        xhr.onload = () => {
            // если HTTP статус в диапазоне 200-299 - успех
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, xhr.response);//null - ошибки нет, возвращает ответ
            } else {
                // ошибка с сервера
                const err = new Error(`Ошибка HTTP: ${xhr.status}`);
                err.status = xhr.status;//статус ошибки
                err.response = xhr.response;//текст ошибки
                callback(err);// callback только  с ошибкой, без response
            }
        };

        //обработчик ошибки, если запрос не выполнен
        xhr.onerror = () => {
            callback(new Error('Ошибка сети или CORS'));
        };
        //отправляем запрос
        xhr.send(formData);
    } catch (err) {  //ловим возможную ошибку из try
        callback(err);
    }
};
