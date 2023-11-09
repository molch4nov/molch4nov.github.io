const axios = require('axios');
const fs = require('fs');
const XLSX = require('xlsx');
const cron = require('node-cron');

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


function readExcelData(filePath) {
    // Чтение файла Excel
    const workbook = XLSX.readFile(filePath);
  
    // Получение первого листа
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
    // Преобразование данных в JSON-объекты
    return XLSX.utils.sheet_to_json(worksheet, {header: ['coordinates', 'fullName', 'name', 'direction', 'inn', 'region', 'ocved', 'dopOcved', 'site', 'address', 'main', 'phone', 'email' ]});
}


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
    if (prop === 'Производство цемента') return 'gray'
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




  cron.schedule('* * * * *', () => {
    axios.get(exportUrl, {responseType: 'arraybuffer'})
  .then((response) => {
    fs.writeFileSync('output.xlsx', response.data);
    console.log('Файл успешно скачан');
      // Чтение данных из Excel-таблицы
    const data = readExcelData(excelFilePath);

    fs.writeFile('BigData.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.error('Ошибка при сохранении данных: ', err);
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
  });

  });
