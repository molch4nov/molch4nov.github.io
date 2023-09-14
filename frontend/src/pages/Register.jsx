import {useEffect, useState} from "react";
import {registerUser} from "../services/auth.service";
import {useNavigate} from "react-router-dom";
import "../styles/login.css";
import InputMask from 'react-input-mask';
import {Modal} from "../components/modal/Modal";

export function Register({isAuth, setIsAuth}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [initials, setInitials] = useState('')
    const [organization, setOrganization] = useState('')
    const [phone, setPhone] = useState('')
    const navigate = useNavigate()
    const [modalActive, setModalActive] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if(isAuth) {
            navigate('/map')
        }
    }, [isAuth, navigate])

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await registerUser(initials, organization, phone, email, password);
            if (res.status === 200) {
                navigate(`/login`)
            } else {
                setModalActive(true);
                setError(res?.response?.data);
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
                    <div className="title__login">Регистрация</div>
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
                                        required
                                         />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Организация</span>
                                    <input
                                        type="text"
                                        placeholder="Введите организацию"
                                        onChange={e => setOrganization(e.target.value)}
                                        value={organization}
                                        required
                                         />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Телефон</span>
                                    <InputMask placeholder="+7 (XXX) XXX-XX-XX" mask="+7 (999) 999-99-99" onChange={e => setPhone(e.target.value)} value={phone}  required/>
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Почта</span>
                                    <input
                                        type="email"
                                        placeholder="Введите адрес электронной почты"
                                        onChange={e => setEmail(e.target.value)}
                                        value={email}
                                        required
                                         />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Пароль</span>
                                    <input
                                        type="password"
                                        placeholder="Введите пароль"
                                        onChange={e => setPassword(e.target.value)}
                                        value={password}
                                        required
                                         />
                                </div>
                                <div className="input-box__login">
                                    <span className="details__login">Один момент...</span>
                                    <div style={{display: 'flex'}}>
                                        <input
                                            style={{width: "45px", height: "45px"}}
                                            type="checkbox"
                                            placeholder="Персональные данные"
                                             />
                                        <p className="checkbox">
                                            <a href="/agreement" target="_blank">
                                                Согласие на обработку персональных данных
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="button__login">
                                <input type="submit" value="Зарегистрироваться" />
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
