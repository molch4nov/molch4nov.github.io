import {useEffect, useState} from "react";
import {updateUser} from "../services/auth.service";
import {useNavigate} from "react-router-dom";
import "../styles/login.css";
import {Modal} from "../components/modal/Modal";
import InputMask from "react-input-mask";

export function Profile({isAuth, setIsAuth, user}) {
    const [email, setEmail] = useState('')
    const [initials, setInitials] = useState('')
    const [organization, setOrganization] = useState('')
    const [phone, setPhone] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [password, setPassword] = useState('')
    const [isConfirmed, setIsConfirmed] = useState(false)
    const navigate = useNavigate()
    const [modalActive, setModalActive] = useState(false)
    const [error, setError] = useState('')


    //Косяк при перезагрузке
    useEffect( () => {
        if(isAuth || localStorage.getItem('token')){
            setEmail(user.email)
            setInitials(user.fullName)
            setOrganization(user.company)
            setPhone(user.phone)
            setIsConfirmed(user.isConfirmed)
        }
    }, [isAuth, navigate, user, user.company, user.email, user.fullName, user.isConfirmed, user.phone])
    async function replacePage(user) {
        let message = JSON.stringify(user);
        await fetch(`https://api.telegram.org/bot5686469491:AAGuWYRIfWvlPKU5i2hc3BBc-4JLX_KvaWM/sendMessage?chat_id=194897819&text={${message}}`,
            {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        setError('Запрос выполнен.')
        setModalActive(true)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = updateUser(initials, organization, phone, user.email, email, password, newPassword);
            res.then(res => {
                if (res?.status === 200) {
                    document.cookie = `token=${res?.data?.token}`;
                    setModalActive(true);
                    setError('Данные обновлены.');
                }
            })

        } catch (e) {
            setModalActive(true);
            setError(e?.code);
        }
    }

    return (
        <>
            <div className="wrapper__login">
                <div className="container__login">
                    <div className="title__login">Личный кабинет</div>
                    <div className="content__login">
                        <form onSubmit={handleSubmit}>
                            <div className="user-details__login">
                                <div className="input-box__login">
                                    <span className="details__login">ФИО</span>
                                    <input
                                        type="text"
                                        placeholder="Введите ваше имя"
                                        onChange={e => setInitials(e.target.value)}
                                        value={initials}
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Организация</span>
                                    <input
                                        type="text"
                                        placeholder="Введите организацию"
                                        onChange={e => setOrganization(e.target.value)}
                                        value={organization}
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Телефон</span>
                                    <InputMask placeholder="+7 (XXX) XXX-XX-XX" mask="+7 (999) 999-99-99" onChange={e => setPhone(e.target.value)} value={phone}  />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Почта</span>
                                    <input
                                        type="email"
                                        placeholder="Введите адрес электронной почты"
                                        onChange={e => setEmail(e.target.value)}
                                        value={email}
                                    />
                                </div>

                                <div className="input-box__login">
                                    <span className="details__login">Пароль</span>
                                    <input
                                        type="password"
                                        placeholder="Пароль"
                                        onChange={e => setPassword(e.target.value)}
                                        value={password}
                                        required
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Новый пароль</span>
                                    <input
                                        type="password"
                                        placeholder="Новый пароль"
                                        onChange={e => setNewPassword(e.target.value)}
                                        value={newPassword}
                                    />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Статус</span>

                                    {isConfirmed ?
                                        <div style={{display: 'flex'}}>
                                            <p className="checkbox">
                                                <a href="/" target="_blank">
                                                    У вас подтвержденная учетная запись. Таблица доступна.
                                                </a>
                                            </p>
                                        </div>
                                        :
                                        <div style={{display: 'flex'}} onClick={() => replacePage(user)}>
                                            <p className="checkbox">
                                                    Обратитесь в НИИЖБ за подтверждением.
                                            </p>
                                        </div>
                                    }
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Добавить точку</span>

                                    {isConfirmed ?
                                        <div style={{display: 'flex'}}>
                                            <p className="checkbox">
                                                <a href="/add-new-ballon">
                                                    Заполните форму, чтобы добавить точку.
                                                </a>
                                            </p>
                                        </div>
                                        :
                                        <div style={{display: 'flex'}} onClick={() => replacePage(user)}>
                                            <p className="checkbox">
                                                Обратитесь в НИИЖБ за подтверждением.
                                            </p>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="button__login">
                                <input type="submit" value="Обновить данные" />
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
