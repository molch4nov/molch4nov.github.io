ymaps.ready(init);

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



async function replacePage(button) {
    const name = button.getAttribute('data-name');
    const coords = button.getAttribute('data-coords');
    const region = button.getAttribute('data-region');
    let message = name + ' ' + coords + ' ' + region
    let response = await fetch(`https://api.telegram.org/bot5686469491:AAGuWYRIfWvlPKU5i2hc3BBc-4JLX_KvaWM/sendMessage?chat_id=194897819&text={${message}}`,
        {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json'
            },
        });
}

async function replaceBal(button) {
    const name = button.getAttribute('data-name');
    const coords = button.getAttribute('data-coords');
    const region = button.getAttribute('data-region');
    let message = name + ' ' + coords + ' ' + region
    let response = await fetch(`https://api.telegram.org/bot5686469491:AAGuWYRIfWvlPKU5i2hc3BBc-4JLX_KvaWM/sendMessage?chat_id=194897819&text={${message}}`,
        {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json'
            },
        });
}

function init () {
    var myMap = new ymaps.Map('map', {

        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 100,
            clusterDisableClickZoom: true
        });

    $.ajax({
        url: "./newData.json"
    }).done(function(data) {
        let objects = [];
        data.features.forEach((item) => {
            objects.push(
                {
                    type: 'Feature',
                    id: item.id,
                    geometry: {
                        type: 'Point',
                        coordinates: item.geometry.coordinates
                    },
                    properties:{
                        region: item.properties.region,
                        balloonContentBody: '<div>'+ '<p>'+ item.properties.balloonContent +'</p>' +'<button onclick="replacePage(this)" data-name="' + item.properties.balloonContent.replaceAll('\"', '') + '" data-coords="' + item.geometry.coordinates + '" data-region="' + item.properties.region + '">Пожаловаться</button>' + '<div>'

                    },
                    options: {
                        iconColor: changeColor(item.properties.direction)
                    }
                }
            )
        })
        objectManager.add(objects);
    });
    myMap.geoObjects.add(objectManager);
}
