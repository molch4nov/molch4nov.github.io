import "../styles/contacts.css"
export function Contacts() {
    return (
        <section className="content_wrapper">
            <div className="contact_container">
                <h1 className="title_landing">Контакты</h1>
                <div className="row">
                    <div className="col-md-6 row-flex__text">
                        <div className="hdr">Адрес интститута:</div>
                        <p>Российская Федерация, 109428, г. Москва, 2-я Институтская ул., д. 6, корп. 5</p>
                        <div className="mini_hdr">Приемная института:</div>
                        <p>Телефон: <a href="tel:84991747724">+7(499)174-77-24</a></p>
                        <p>E-mail: <a href="mailto:niizhb@cstroy.ru">niizhb@cstroy.ru</a></p>
                        <div className="mini_hdr">Директор института НИИЖБ им. А.А. Гвоздева</div>
                        <p>Кузеванов Дмитрий Владимирович<br/> Кандидат технических наук</p>
                    </div>
                    <div className="col-md-6">
                        <iframe
                            title={"maps"}
                            src="https://yandex.ru/map-widget/v1/?lang=ru_RU&amp;scroll=true&amp;um=constructor%3A6a79a700412e41901f766811fd5e5f1033c69a86acc7c3d1f9d1a7c1c7ef7289"
                            allowFullScreen="true" width="95%" height="350px" style={{display: "block", margin: 0}}></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}
