const axios = require('axios');
const fs = require('fs');
const XLSX = require('xlsx');
const cron = require('node-cron');
const { error } = require('console');

//first step
const spreadsheetId = '1zL7vFit6MekkL4a9NMHBD_RFl7Z5Iv1KeKxjNl64mgE';
const exportUrl = `https://docs.google.com/spreadsheets/export?id=${spreadsheetId}&exportFormat=xlsx`;

//second step
// Путь к файлу Excel
const excelFilePath = './output.xlsx';

//thirs step 
// Путь к исходному JSON-файлу
const inputFilePath = 'BigData.json';

// Путь к файлу, в который будет сохранен преобразованный JSON
const outputFilePath = 'BigDataYandex.json';


async function sendErrorToTelegram(message = 'Ошибка') {
  let response = await fetch(`https://api.telegram.org/bot6956473229:AAFJRvpEuzOOqrux7WPZr4Cr1I4ks2w8UNY/sendMessage?chat_id=242572348&text=${message}`,
  {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
          'Content-Type': 'application/json'
      },
  });
}

function sendError(message = 'Ошибка') {
  sendErrorToTelegram(message)
  .then(result => {
    console.log(result);
    console.log('res')
  })
  .catch(error => {
    console.log(error)
    console.log('error')
  } )
  .finally(() => console.log('Обработка ошибки выполнена.'))

  console.log(message);
}





function readExcelData(filePath) {
  let workbook;
  // Чтение файла Excel
  if (XLSX) {
    workbook = XLSX.readFile(filePath);
  } else {
    sendError('Файл не прочитался и workbook не создался')
  }
  // Получение первого листа
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  if (worksheet) {
    // Преобразование данных в JSON-объекты
    return XLSX.utils.sheet_to_json(worksheet, {header: ['coordinates', 'fullName', 'name', 'direction', 'inn', 'region', 'ocved', 'dopOcved', 'site', 'address', 'main', 'phone', 'email' ]});
  } else {
    sendError('Ошибка при получении первого листа.')
  }
}


// Функция для чтения данных из JSON-файла
function readJsonData(filePath) {
    const jsonData = fs.readFileSync(filePath);
    if (jsonData) {
      return JSON.parse(jsonData);
    } else {
      sendError('Файл не считался и файл jsonData не создался.')
    } 
}
  
const changeColor = (prop) => {
    if (prop === 'Заводы ЖБИ') return 'gray'
    if (prop === 'Заводы и комбинаты ДСК') return 'orange'
    if (prop === 'Производство добавок') return 'yellow'
    if (prop === 'Производство заполнителей для легкого бетона') return 'green'
    if (prop === 'Производство заполнителей для тяжелого бетона') return 'blue'
    if (prop === 'Производство композитной арматуры') return 'purple'
    if (prop === 'Производство стальной арматуры') return 'snow'
    if (prop === 'Производство товарного бетона') return 'pink'
    if (prop === 'Производства цемента') return 'gray'
    return 'gray'
}
  
  // Функция для преобразования данных
function transformData(data) {
  if (!data) sendError(`Данные data отсутствуют и имеют значение ${data}`);

  return data.map((item, index) => {
    if(item) {
      let coordinates;
      if(item.coordinates.includes(',')) {
        coordinates = item?.coordinates?.split(',');
      } else {
        coordinates = ['0', '0'];
        sendError(`Ошибка при заполнении координат. Вот что внутри для ${item.name} по ${index} ${item.coordinates}`);
      }
      
      return {
      type: 'Feature',
      id: index + 1,
      geometry: {
          type: 'Point',
          coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
      },
      properties: {
          region: item.region ? item.region : 'Отсутствует',
          balloonContentBody: item.name ? item.name : 'Отсутствует',
          direction: item.direction ? item.direction : 'Отсутствует',
          inn: item.inn ? item.inn : 'ИНН отсутствует.',
          ocved: item.ocved ? item.ocved : 'ОКВЭД отсутствует.',
          site: item.site ? item.site : 'Сайт отсутствует.',
          address: item.address ? item.address : 'Адрес не указан.',
          main: item.main ? item.main : 'Информации нет.',
          phone: item.phone ? item.phone : 'Телефон отсутствует.',
          email: item.email ? item.email : 'Почта отсутствует'
      },
      options: {
          iconColor: changeColor(item.direction)
      }
      };
    } else {
      sendError('Ошибка при преобразовании данных. Дело в item.')
    }
  });
}




  cron.schedule('*/10 * * * *', () => {
    axios.get(exportUrl, {responseType: 'arraybuffer'})
  .then((response) => {
    fs.writeFileSync('output.xlsx', response.data);
    console.log('Файл успешно скачан');
      // Чтение данных из Excel-таблицы
    const data = readExcelData(excelFilePath);

    fs.writeFile('BigData.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.error('Ошибка при сохранении данных: ', err);
          sendError('Ошибка при сохранении данных: ' + err.message)
          return;
        }
        console.log('Данные успешно сохранены в BigData.json');
        const jsonData = fs.readFileSync('BigData.json');
        // Преобразуем содержимое файла в объект JSON
        const data = JSON.parse(jsonData);
        // Удаляем первую запись
        data.shift();
        // Преобразуем объект JSON обратно в строку
        const updatedJsonData = JSON.stringify(data, null, 2);
        // Записываем обновленные данные обратно в файл
        fs.writeFileSync('BigData.json', updatedJsonData);
        console.log('Первая запись успешно удалена');
        // Чтение данных из исходного JSON-файла
        const inputData = readJsonData(inputFilePath);

        // Преобразование данных
        const outputData = transformData(inputData);

        // Сохранение преобразованных данных в JSON-файл
        fs.writeFileSync(outputFilePath, JSON.stringify(outputData));
      });
  })
  .catch((error) => {
    console.error('Ошибка при скачивании файла:', error);
    sendError('Ошибка при скачивании файла:' + error)
  });

  });