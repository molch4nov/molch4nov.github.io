import data from '../yandex/newData.json'
export const useMap = () => {
    let region = [];
    let category = [];


    let dataForMap = data

    let regForMap = [];
    let catForMap = [];

    function sortArrayByFirstTwoDigits(arr) {
        arr.sort((a, b) => {
            const firstTwoDigitsA = parseInt(a.toString().substring(0, 2));
            const firstTwoDigitsB = parseInt(b.toString().substring(0, 2));
            return firstTwoDigitsA - firstTwoDigitsB;
        });
        return arr;
    }


    data.features.forEach((item) => {
        region.push(item.properties.region)
        category.push(item.properties.direction)
    })

    let reg = new Set(region)
    let cat = new Set(category)

    reg = Array.from(reg)
    cat = Array.from(cat)

    reg = sortArrayByFirstTwoDigits(reg)
    cat = sortArrayByFirstTwoDigits(cat)

    function reRender (regForMap, catForMap, typ, prop) {
        if(typ === 1) {
            if(regForMap.includes(prop)){
                for(let i = 0; i < regForMap.length; i++) {
                    if(prop === regForMap[i]) {
                        regForMap.splice(i, 1)
                    }
                }
            } else  {
                regForMap.push(prop)
            }
        } else {
            if(catForMap.includes(prop)){
                for(let i = 0; i < catForMap.length; i++) {
                    if(prop === catForMap[i]) {
                        catForMap.splice(i, 1)
                    }
                }
            } else {
                catForMap.push(prop)
            }
        }

        if(regForMap.length === 0 && catForMap.length === 0) {
            dataForMap = data;
        } else {
            dataForMap = {
                "type": "FeatureCollection",
                "features": []
            }
            data.features.forEach((item) => {
                if(regForMap.includes(item.properties.region) || catForMap.includes(item.properties.direction)){
                    dataForMap.features.push(
                        {"type":"Feature",
                            "id":item.id,
                            "geometry":{"type":"Point","coordinates":item.geometry.coordinates},
                            "properties":{
                                "region":item.properties.region,
                                "balloonContent":item.properties.balloonContent,
                                "direction":item.properties.direction
                            }
                        }
                    )
                }
            })
            console.log(dataForMap)
        }
    }



    reg = reg.map(
        (reg) => <div key={crypto.randomUUID()} onClick={() => reRender(regForMap, catForMap, 1, reg)}>{reg}</div>
    )

    cat = cat.map(
        (cat) => <div key={crypto.randomUUID()} onClick={() => reRender(regForMap, catForMap, 2, cat)}>{cat}</div>
    )


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

    const defaultState = {
        center: [55.76, 37.64],
        zoom: 10,
    };
    const myStyle = {
        width: "calc(100vw)",
        height: "calc(100vh - 214px)"
    }
    return [defaultState, myStyle, data, reg, cat, dataForMap]
}


