import "./style.css"
export function Header() {
    return (
        <header className="header">
            <div className="header__wrapper">
                <h1 className="header__title">
                    <strong>Интерактивная карта</strong><br/>
                    <strong><em>ИНДУСТРИИ БЕТОНА И ЖЕЛЕЗОБЕТОНА</em></strong>
                </h1>
                <a href="#!" className="btn">Начать сейчас</a>
            </div>
        </header>
    )
}
