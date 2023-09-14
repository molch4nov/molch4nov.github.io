import { NavLink } from "react-router-dom";
import "./style.css"
import logo from "../../img/logo/logo.png";
import {logoutUser} from "../../services/auth.service";

const activeLink = "nav-list__link nav-list__link--active";
const normalLink = "nav-list__link";
export function Navbar({isAuth, setIsAuth}) {
    const width = window.innerWidth;
    const enter = isAuth ? 'Выйти' : 'Вход';
    return (
        <nav className="nav">
            <div className="container">
                <div className="nav-row">
                    <NavLink to="/" className="logo" >
                        {width > 400 ?  <img src={ logo } alt="НИИЖБ ИМ. А.А.ГВОЗДЕВА"/> : <></>}
                    </NavLink>

                    <ul className="nav-list">
                        <li className="nav-list__item">
                            <NavLink to="/" className={({isActive}) => {
                                return isActive ? normalLink : normalLink;
                            }}>
                                Карта
                            </NavLink>
                        </li>
                        <li className="nav-list__item">
                            <NavLink to="/contacts" className={({isActive}) => {
                                return isActive ? normalLink : normalLink;
                            }}>
                                Контакты
                            </NavLink>
                        </li>
                        {isAuth && <li className="nav-list__item">
                            <NavLink to="/profile" className={({isActive}) => {
                                return isActive ? normalLink : normalLink;
                            }}>
                                Личный кабинет
                            </NavLink>
                        </li>}
                        {!isAuth && <li className="nav-list__item">
                            <NavLink to="/register" className={({isActive}) => {
                                return isActive ? normalLink : normalLink;
                            }}>
                                Регистрация
                            </NavLink>
                        </li>}
                        <li className="nav-list__item">
                            <NavLink to="/login" className={({isActive}) => {
                                return isActive ? activeLink : normalLink;
                            }} onClick={() => {
                                setIsAuth(false);
                                logoutUser();
                            }}>
                                {enter}
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
