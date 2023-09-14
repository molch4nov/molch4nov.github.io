import "./style.css"
import tg from "../../img/icons/tg.png";
export function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__wrapper">
                    <ul className="social">
                        <li className="social__item"><a rel="noreferrer"  target="_blank" href="https://t.me/NIIZHB_bot"><img style={{width: "38px"}} src={tg} alt="Link"/></a></li>
                        <li className="social__item">niizhb@cstroy.ru</li>
                        <li className="social__item">+7 (499) 174-77-24</li>
                    </ul>
                    <div className="copyright">
                        <p>© 2023 github.com/molch4nov</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
