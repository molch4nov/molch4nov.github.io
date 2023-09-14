import {Map, ObjectManager, TypeSelector, YMaps} from '@pbe/react-yandex-maps';
import '../styles/map.css'
import React, {useEffect, useState} from "react";
import data from '../yandex/BigDataYandex.json'
import {Modal} from "../components/modal/Modal";
import {DataGrid, useGridApiRef} from '@mui/x-data-grid';
import Box from '@mui/material/Box';


export function Map2({isAuth}) {
    const [isRecount, setIsRecount] = useState(false)


    const [first, setFirst] = useState(0);
    const [second, setSecond] = useState(0);
    const [third, setThird] = useState(0);
    const [fourth, setFourth] = useState(0);
    const [fifth, setFifth] = useState(0);
    const [sixth, setSixth] = useState(0);
    const [seventh, setSeventh] = useState(0);
    let regForMap = [];
    let rows = [];
    useEffect(() => {
        init()
        if(!isAuth){
            setError('Для получения полного доступа зарегестрируйтесь и подтвердите учетную запись в АЖБ')
            setModalActive(true)
        }
    }, [isAuth])

    const [isComment, setIsComment] = useState(false);
    const [comment, setComment] = useState('')
    const [modalActive, setModalActive] = useState(false)
    const [error, setError] = useState('')
    const [map, setMap] = useState(true);
    const [selectedObject, setSelectedObject] = useState({
        coordinates: '',
        id: '',
        regionObject: '',
        direction: '',
        balloonContent: '',
        inn: '',
    });
    const [selected, setSelected] = useState(false);
    let objects = [];
    let region = [];
    let category = [];
    let apiRef = useGridApiRef();
    let objectManager = React.createRef();
    let mapManager = React.createRef();

    let catForMap = [];
    function sortArrayByFirstTwoDigits(arr) {
        arr.sort((a, b) => {
            const firstTwoDigitsA = parseInt(a.toString().substring(0, 2));
            const firstTwoDigitsB = parseInt(b.toString().substring(0, 2));
            return firstTwoDigitsA - firstTwoDigitsB;
        });
        return arr;
    }

    const [defaultState, setDefaultState] = useState({
        center: [61.775181, 81.635519],
        zoom: 4,
    })

    data.forEach((item) => {
        region.push(item.properties.region)
        category.push(item.properties.direction)
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
                    direction: item.properties.direction,
                    balloonContentBody: item.properties.balloonContentBody
                },
                options: {
                    iconColor: item.options.iconColor
                }
            }
        )
        rows.push({id: item.id,
            firstName: item.properties.balloonContentBody,
            direction: item.properties.direction,
            region: item.properties.region,
            inn: item.properties.inn,
            ocved: item.properties.ocved,
            address: item.properties.address,
            main: item.properties.main,
            phone: item.properties.phone,
            email: item.properties.email,
            coordinates: item.geometry.coordinates})
    })



    if(!isAuth && rows.length > 4) {
        rows = rows.slice(0, 5)
    }

    let reg = new Set(region)
    let cat = new Set(category)

    reg = Array.from(reg)
    cat = Array.from(cat)

    let regDefault = sortArrayByFirstTwoDigits(reg)
    let catDefault = sortArrayByFirstTwoDigits(cat)



    reg = regDefault.map(
        (reg) => <div key={crypto.randomUUID()} id={'dynamic-'+reg} onClick={() => {reRender(regForMap, catForMap, 1, reg);}}>{reg}</div>
    )

    cat = catDefault.map(
        (cat) => <div key={crypto.randomUUID()} id={'dynamic-'+cat} onClick={() => {reRender(regForMap, catForMap, 2, cat)}}>{cat}</div>
    )

    let totalizer = [
        ['Заводы ЖБИ', 5471],
        ['Производство стальной арматуры', 24],
        ['Производство заполнителей для легкого бетона', 37],
        ['Производство цемента', 16],
        ['Производство заполнителей для тяжелого бетона', 321],
        ['Производство товарного бетона', 2432],
        ['Производство композитной арматуры', 12]
    ]

    let helper1 = regForMap
    let helper2 = catDefault
    let helper3 = category
    function init() {
    //     let cnt1 = 0;
    //     helper2.map((id, index) =>  {
    //         cnt1 = 0;
    //         helper3.forEach((item) => {
    //                 if(id === item) {
    //                     cnt1 += 1;
    //                 }
    //             }
    //         )
    //         totalizer[index][1] += cnt1;
    //     } )
        setFirst(totalizer[0][1])
        setSecond(totalizer[1][1])
        setThird(totalizer[2][1])
        setFourth(totalizer[3][1])
        setFifth(totalizer[4][1])
        setSixth(totalizer[5][1])
        setSeventh(totalizer[6][1])
    }


    

    function reCount() {
        totalizer = [
            ['Заводы ЖБИ', 0],
            ['Производство стальной арматуры', 0],
            ['Производство заполнителей для легкого бетона', 0],
            ['Производство цемента', 0],
            ['Производство заполнителей для тяжелого бетона', 0],
            ['Производство товарного бетона', 0],
            ['Производство композитной арматуры', 0]
        ]
        objects.map((obj) =>  {
            helper2.forEach(
                (cat, index) => {
                    let cnt2 = 0;
                    helper1.forEach(
                        (reg) => {
                            if(obj.properties.region === reg && obj.properties.direction === cat) {
                                cnt2 += 1;
                            }
                        }
                    )
                    totalizer[index][1] += cnt2;
                }

            )

        } )
        setFirst(totalizer[0][1])
        setSecond(totalizer[1][1])
        setThird(totalizer[2][1])
        setFourth(totalizer[3][1])
        setFifth(totalizer[4][1])
        setSixth(totalizer[5][1])
        setSeventh(totalizer[6][1])
    }

    let colors = [
        '#5B9BD5', '#3D6BB5', '#002060', '#3D6BB5', '#5B9BD5', '#3D6BB5', '#002060',
    ]

    function reRender (regForMap, catForMap, typ, prop) {
        if(typ === 1) {
            if(regForMap.includes(prop)){
                for(let i = 0; i < regForMap.length; i++) {
                    if(prop === regForMap[i]) {
                        regForMap.splice(i, 1)
                        document.getElementById("dynamic-" + prop).style.color = 'rgb(0, 0, 0)';
                    }
                }
            } else  {
                regForMap.push(prop)
                document.getElementById("dynamic-" + prop).style.color = 'rgb(0, 163, 92)';
            }
        }
        if (typ === 2){
            if(catForMap.includes(prop)){
                for(let j = 0; j < catForMap.length; j++) {
                    if(prop === catForMap[j]) {
                        catForMap.splice(j, 1)
                        document.getElementById("dynamic-" +prop).style.color = 'rgb(0, 0, 0)';
                    }
                }
            } else {
                catForMap.push(prop)
                document.getElementById("dynamic-" + prop).style.color = 'rgb(0, 163, 92)';
            }
        }

        if(regForMap.length === 0 && catForMap.length === 0) {
            objectManager?.current?.setFilter()
        }
        if(regForMap.length !== 0 && catForMap.length !== 0) {
            objectManager?.current?.setFilter(function(object) {
                let bool = true;
                bool = bool && catForMap.includes(object.properties.direction);
                bool = bool && regForMap.includes(object.properties.region)
                return bool
            })
            return
        }
        if (catForMap.length !== 0){
            objectManager?.current?.setFilter(function(object) {
                return catForMap.includes(object.properties.direction)
            })
        }
        if (regForMap.length !== 0){
            objectManager?.current?.setFilter(function(object) {
                return regForMap.includes(object.properties.region)
            })
        }
    }



    const handleObjectClick = (e) => {
        const objectId = e.get('objectId');
        const object = data.find(obj => obj.id === objectId)
        if (object) {
            let coordinates = object.geometry.coordinates;
            let id = object.id;
            let regionObject = object.properties.region;
            let direction = object.properties.direction;
            let balloonContent = object.properties.balloonContentBody;
            let inn = object.properties.inn
            setSelectedObject({coordinates: coordinates, id: id, regionObject: regionObject, balloonContent: balloonContent, direction: direction, inn: inn})
            setSelected(true)
        }
    };

    const myStyle = {
        width: "calc(100vw)",
        height: "calc(100vh - 177px)"
    }
    const handleSubmit = async () => {
        let message = comment + selectedObject.id + ' ' + selectedObject.balloonContent;
        let response = await fetch(`https://api.telegram.org/bot5686469491:AAGuWYRIfWvlPKU5i2hc3BBc-4JLX_KvaWM/sendMessage?chat_id=194897819&text={${message}}`,
            {
                method: 'POST',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        if (response.status === 200){
            setError('Данные отправлены на обработку');
            setModalActive(true)
        } else{
            setError('Ошибка отправки. Повторите позднее.');
            setModalActive(true)
        }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 40 },
        {
            field: 'firstName',
            headerName: 'Название',
            width: 200,
            editable: true,
        },
        {
            field: 'direction',
            headerName: 'Направление',
            width: 120,
            editable: true,
        },
        {
            field: 'region',
            headerName: 'Регион',
            type: 'string',
            width: 110,
            editable: true,
        },
        {
            field: 'inn',
            headerName: 'ИНН',
            sortable: false,
            width: 130,

        },
        {
            field: 'ocved',
            headerName: 'ОКВЭД',
            sortable: false,
            width: 80,

        },
        {
            field: 'address',
            headerName: 'Адрес',
            sortable: false,
            width: 250,

        },
        {
            field: 'main',
            headerName: 'Руководитель',
            sortable: false,
            width: 250,

        },
        {
            field: 'phone',
            headerName: 'Телефон',
            sortable: false,
            width: 190,

        },
        {
            field: 'email',
            headerName: 'Почта',
            sortable: false,
            width: 160,

        },
        {
            field: 'coordinates',
            headerName: 'Координаты',
            sortable: false,
            width: 160,
        },
    ];
    const handleRowClick = (params) => {
        setSelectedObject({coordinates: params.row.coordinates,
            id: params.id,
            regionObject: params.row.region,
            balloonContent: params.row.firstName,
            direction: params.row.direction,
            inn: params.row.inn})
    };

    return(
        <>
            <div className="container_for_features">
                <div className="container_for_map">
                    {map && <YMaps>
                        <Map
                            defaultState={defaultState}
                            style={myStyle}
                            instanceRef={mapManager}
                        >
                            <TypeSelector options={{float: 'left'}}/>
                            <ObjectManager
                                instanceRef={objectManager}
                                options={{
                                    clusterize: true,
                                    gridSize: 100
                                }}
                                clusters={{
                                    groupByCoordinates: false,
                                    clusterDisableClickZoom: true,
                                    clusterHideIconOnBalloonOpen: false,
                                    geoObjectHideIconOnBalloonOpen: false,
                                }}
                                onClick={handleObjectClick}
                                features={objects}
                                modules={[
                                    "objectManager.addon.objectsBalloon",
                                    "objectManager.addon.objectsHint",
                                ]}
                            />
                        </Map>
                    </YMaps>}
                    {!map &&
                        <div className="scroll-table">
                            <Box sx={{ height: "calc(100vh - 177px)", width: '100vw' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 10,
                                            },
                                        },
                                    }}
                                    apiRef={apiRef}
                                    onRowClick={handleRowClick}
                                    pageSizeOptions={[10]}
                                    checkboxSelection={false}
                                />
                            </Box>

                        </div>
                    }
                </div>
                <div className="container_for_map_info">
                    <div className="" style={{width: "calc(100% / 7)", backgroundColor: colors[0], height: "77px"}} key={crypto.randomUUID()}>
                        <p className="cat_prop_p_number"><strong>{first}</strong></p>
                        <p className="cat_prop_p">{totalizer[0][0]}</p>
                    </div>
                    <div className="" style={{width: "calc(100% / 7)", backgroundColor: colors[1]}} key={crypto.randomUUID()}>
                        <p className="cat_prop_p_number"><strong>{second}</strong></p>
                        <p className="cat_prop_p">{totalizer[1][0]}</p>
                    </div>
                    <div className="" style={{width: "calc(100% / 7)", backgroundColor: colors[2]}} key={crypto.randomUUID()}>
                        <p className="cat_prop_p_number"><strong>{third}</strong></p>
                        <p className="cat_prop_p">{totalizer[2][0]}</p>
                    </div>
                    <div className="" style={{width: "calc(100% / 7)", backgroundColor: colors[3]}} key={crypto.randomUUID()}>
                        <p className="cat_prop_p_number"><strong>{fourth}</strong></p>
                        <p className="cat_prop_p">{totalizer[3][0]}</p>
                    </div>
                    <div className="" style={{width: "calc(100% / 7)", backgroundColor: colors[4]}} key={crypto.randomUUID()}>
                        <p className="cat_prop_p_number"><strong>{fifth}</strong></p>
                        <p className="cat_prop_p">{totalizer[4][0]}</p>
                    </div>
                    <div className="" style={{width: "calc(100% / 7)", backgroundColor: colors[5]}} key={crypto.randomUUID()}>
                        <p className="cat_prop_p_number"><strong>{sixth}</strong></p>
                        <p className="cat_prop_p">{totalizer[5][0]}</p>
                    </div>
                    <div className="" style={{width: "calc(100% / 7)", backgroundColor: colors[6]}} key={crypto.randomUUID()}>
                        <p className="cat_prop_p_number"><strong>{seventh}</strong></p>
                        <p className="cat_prop_p">{totalizer[6][0]}</p>
                    </div>


                </div>
                <div className="container_for_filter">
                    <nav role='navigation'>
                        <div id="menuToggle">
                            <input type="checkbox" />
                            <span></span>
                            <span></span>
                            <span></span>
                            <ul id="menu">
                                    <p style={{fontSize: "22px"}}><strong>Категории</strong></p>
                                    <div className="region" style={{height: "155px"}} >
                                        {cat}
                                    </div>
                                <li>
                                    <p><strong>Регион и субъект</strong></p>

                                    <div className="region">
                                        {reg}
                                    </div>
                                </li>
                                <li style={{display: "flex", height: "90px"}}>
                                    <div>
                                        <p><strong>Вид</strong></p>
                                        <div className="close_filter" onClick={() => {
                                            setMap(!map);
                                            if(selectedObject && !map){
                                                setSelected(true)
                                                setDefaultState({
                                                    center: selectedObject.coordinates ? selectedObject.coordinates : [61.775181, 81.635519],
                                                    zoom:  selectedObject.coordinates ? 12 : 4,
                                                })
                                            } else {
                                                setSelected(false)
                                            }
                                        }}>
                                            {map ? 'Таблица' : 'Карта'}
                                        </div>
                                    </div>
                                    <div className="close_filter" style={{marginLeft: "20px"}} onClick={() => {
                                        objectManager?.current?.setFilter();
                                        // init()
                                        for(let g = 0; g < catForMap.length; g++) {
                                            document.getElementById(`dynamic-${catForMap[g]}`).style.color = 'black';
                                        }
                                        for(let g = 0; g < regForMap.length; g++) {
                                            document.getElementById(`dynamic-${regForMap[g]}`).style.color = 'black';
                                        }
                                    }}>
                                        Сбросить фильтр
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                {selected && (
                    <div className="container_for_object_info">
                        <strong>
                            <h1 className="h1_title">{selectedObject.balloonContent}</h1>
                        </strong>
                        <h2 className="h2_title"> <strong>Регион:</strong> {selectedObject.regionObject.split('-')[1]}</h2>
                        <h2 className="h2_title"> <strong>Направление:</strong> {selectedObject.direction}</h2>
                        <h2 className="h2_title"> <strong>Координаты объекта:</strong></h2>
                        <h2 className="h2_title">{selectedObject.coordinates[0]}     {selectedObject.coordinates[1]}</h2>
                        <h2 className="h2_title"><strong>ИНН:</strong> {selectedObject.inn}</h2>
                        <div style={{display: "flex", flexDirection: "column", bottom: '0', position: "relative"}}>
                            <button className="close_title" onClick={() => {setSelected(false); setSelectedObject(null); setIsComment(false)}}>Закрыть</button>
                            <button className="close_title" onClick={() => setIsComment(true)}>Комментарий</button>
                            {isComment && (
                                    <>
                                        <input className="comment_input" type="text" onChange={e => setComment(e.target.value)} value={comment}/>
                                        <button className="close_title" onClick={() => handleSubmit()}>Отправить</button>
                                    </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <p>
                    {error}
                </p>
            </Modal>
        </>
    )
}
