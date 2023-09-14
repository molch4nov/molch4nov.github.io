import {useState} from "react";
import "../styles/login.css";
import {Modal} from "../components/modal/Modal";

export function AddNewBallon({isAuth, setIsAuth}) {
    const [coordinates, setCoordinates] = useState('')
    const [direction, setDirection] = useState('')
    const [region, setRegion] = useState('')
    const [ocved, setOcved] = useState('')
    const [site, setSite] = useState('')
    const [address, setAddress] = useState('')
    const [main, setMain] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState()
    const [name, setName] = useState('')
    const [inn, setInn] = useState('')
    const [modalActive, setModalActive] = useState(false)
    const [error, setError] = useState('')

    async function replacePage(name, inn, email, phone, main, address, site, ocved, region, direction, coordinates) {
        try {
            await fetch('http://84.201.163.76:8000/api/addpoint',
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            name: name,
                            inn: inn,
                            email: email,
                            phone: phone,
                            main: main,
                            address: address,
                            site: site,
                            ocved: ocved,
                            region: region,
                            direction: direction,
                            coordinates: coordinates
                        }
                    ),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            setError('Запрос выполнен.')
            setModalActive(true)
        } catch (e) {
            setError('Возникла ошибка.')
            setModalActive(true)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if(name !== '' && inn !== '') {
                await replacePage(name, inn, email, phone, main, address, site, ocved, region, direction, coordinates);
                setModalActive(true);
                setError('Запрос отправлен.');
            } else {
                setModalActive(true);
                setError('Поля название организации и ИНН должны быть заполнены.');
            }
        } catch (e) {
            setModalActive(true);
            setError(e?.code);
        }
    }

    return (
        <>
            <div className="wrapper__login">
                <div className="container__login">
                    <div className="title__login">Добавление новой точки на карту</div>
                    <div className="content__login">
                        <form onSubmit={handleSubmit}>
                            <div className="user-details__login">
                                <div className="input-box__login">
                                    <span className="details__login">Название организации</span>
                                    <input
                                        type="text"
                                        placeholder="Введите название организации"
                                        onChange={e => setName(e.target.value)}
                                        value={name}
                                        required
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">ИНН</span>
                                    <input
                                        type="text"
                                        placeholder="Введите ИНН организации"
                                        onChange={e => setInn(e.target.value)}
                                        value={inn}
                                        required
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Почта</span>
                                    <input
                                        type="text"
                                        placeholder="Введите почту организации."
                                        onChange={e => setEmail(e.target.value)}
                                        value={email}
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Телефон</span>
                                    <input
                                        type="text"
                                        placeholder="Введите телефон организации"
                                        onChange={e => setPhone(e.target.value)}
                                        value={phone}
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Руководитель</span>
                                    <input
                                        type="text"
                                        placeholder="Введите ФИО руководителя"
                                        onChange={e => setMain(e.target.value)}
                                        value={main}
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Адрес</span>
                                    <input
                                        type="text"
                                        placeholder="Введите адрес организации"
                                        onChange={e => setAddress(e.target.value)}
                                        value={address}
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Сайт</span>
                                    <input
                                        type="text"
                                        placeholder="Введите сайт организации"
                                        onChange={e => setSite(e.target.value)}
                                        value={site}
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">ОКВЭД</span>
                                    <input
                                        type="text"
                                        placeholder="Введите ОКВЭД организации"
                                        onChange={e => setOcved(e.target.value)}
                                        value={ocved}
                                    />
                                </div>

                                <div className="input-box__login">
                                    <span className="details__login">Регион</span>
                                    <input
                                        type="text"
                                        placeholder="Введите регион организации"
                                        onChange={e => setRegion(e.target.value)}
                                        value={region}
                                    />
                                </div>

                                <div className="input-box__login">
                                    <span className="details__login">Направление</span>
                                    <input
                                        type="text"
                                        placeholder="Введите направление организации"
                                        onChange={e => setDirection(e.target.value)}
                                        value={direction}
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Координаты</span>
                                    <input
                                        type="text"
                                        placeholder="Введите координаты организации"
                                        onChange={e => setCoordinates(e.target.value)}
                                        value={coordinates}
                                    />
                                </div>


                            </div>
                            <div className="button__login">
                                <input type="submit" value="Сделать запрос на добавление" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <p>
                    {error}
                </p>
            </Modal>

        </>
    )
}
