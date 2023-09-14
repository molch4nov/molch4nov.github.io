import {useEffect, useState} from "react";
import {loginUser} from "../services/auth.service";
import {useNavigate} from "react-router-dom";
import "../styles/login.css";
import {Modal} from "../components/modal/Modal";
export function Login ({isAuth, setIsAuth, setUser}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [modalActive, setModalActive] = useState(false)
    const [error, setError] = useState('')


    useEffect(() => {
        if(isAuth) {
            navigate('/')
        }
    }, [isAuth, navigate])

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await loginUser(email, password);
            if (res.status === 200) {
                localStorage.setItem('token', res.data.refreshToken);
                setIsAuth(true);
                setUser(res.data.user);
                navigate(`/`);
            } else {
                setModalActive(true);
                setError(res?.response?.data);
            }
        } catch (e) {
            console.log(e)
            setModalActive(true);
            setError(e?.code);
        }
    }

    return (
        <>
            <div className="wrapper__login">
                <div className="container__login">
                    <div className="title__login">Авторизация</div>
                    <div className="content__login">
                        <form onSubmit={handleSubmit}>
                            <div className="user-details__login">
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

                            </div>
                            <div className="button__login">
                                <input type="submit" value="Войти" />
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


