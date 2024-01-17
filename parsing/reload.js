const fs = require('fs');

// Путь к исходному JSON-файлу
const inputFilePath = 'BigData.json';

// Путь к файлу, в который будет сохранен преобразованный JSON
const outputFilePath = 'BigDataYandex.json';

// Функция для чтения данных из JSON-файла
function readJsonData(filePath) {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
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
}

// Функция для преобразования данных
function transformData(data) {
  return data.map((item, index) => {
    const coordinates = item.coordinates.split(',');
    return {
      type: 'Feature',
      id: index + 1,
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
      },
      properties: {
        region: item.region,
        balloonContentBody: item.name,
        direction: item.direction,
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
  });
}

// Чтение данных из исходного JSON-файла
const inputData = readJsonData(inputFilePath);

// Преобразование данных
const outputData = transformData(inputData);

// Сохранение преобразованных данных в JSON-файл
fs.writeFileSync(outputFilePath, JSON.stringify(outputData));
