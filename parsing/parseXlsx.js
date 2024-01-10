const XLSX = require('xlsx');

// Путь к файлу Excel
const excelFilePath = './p.xlsx';

// Функция для чтения данных из Excel-таблицы
function readExcelData(filePath) {
  // Чтение файла Excel
  const workbook = XLSX.readFile(filePath);

  // Получение первого листа
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Преобразование данных в JSON-объекты
  return XLSX.utils.sheet_to_json(worksheet, {header: ['coordinates', 'fullName', 'name', 'direction', 'inn', 'region', 'ocved', 'dopOcved', 'site', 'address', 'main', 'phone', 'email' ]});
}
// Чтение данных из Excel-таблицы
const data = readExcelData(excelFilePath);

// Сохранение данных в JSON-файл
const fs = require('fs');
fs.writeFile('BigData.json', JSON.stringify(data, null, 2), (err) => {
  if (err) {
    console.error('Ошибка при сохранении данных: ', err);
    return;
  }
  console.log('Данные успешно сохранены в output.json');
});