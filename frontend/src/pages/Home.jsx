import {Header} from "../components/header/Header";
import First from "../img/main-page/first.jpg";
import Second from "../img/main-page/second.jpg";
import Third from "../img/main-page/third.jpg";
import Example from "../img/example.png"
export function Home(){

    return (
        <>
            <Header />

            <main className="section">
                <div className="container">

                    <ul className="content-list">
                        <li className="content-list__item">
                            <h2 className="title-2">О проекте
                            </h2>
                            <p className="text-center">Облачная платформа для заказчика, производителей и строительных лабораторий
                            </p>
                            <div className="image-list">
                                <div className="image-list__item">
                                    <img src={First} alt="" className="w-40 my-8 mx-auto" />
                                    <p className="w-40 text-lg mx-auto ">
                                        Собирает в одном месте всю информацию по испытаниям
                                    </p>
                                </div>
                                <div className="image-list__item">
                                    <img src={Second} alt="" className="w-40 my-8 mx-auto "  />
                                    <p className="w-40 text-lg mx-auto">
                                        Анализирует и составляет наглядные графики качества продукции
                                    </p>
                                </div>
                                <div className="image-list__item">
                                    <img src={Third} alt="" className="w-40 my-8 mx-auto" />
                                    <p className="w-48 text-lg mx-auto">
                                        Делает выводы и предлагает способы устранения дефектов производства
                                    </p>
                                </div>

                            </div>
                        </li>

                        <li className="content-list__item">
                            <h2 className="title-2">Пример результатов обработки данных арматуры
                            </h2>
                            <img src={Example} alt="" />
                            <p>
                                В нормативных документах как РФ, так и зарубежных стран на строительную продукцию при статистической обработке результатов испытаний предполагается распределение значений только по нормальному закону с обеспеченностью от 0,90 до 0,95. Не соблюдение этого закона не допустимо!
                            </p>
                        </li>

                        <li className="content-list__item">
                            <h2 className="title-2">О материалах</h2>
                            <p>
                                <a href="/property" style={{color: "black"}}>Подробнее прочитать о материалах, которые могут участвовать в анализе нашего сервиса вы можете <strong>тут</strong>.</a>
                            </p>
                        </li>

                        <li className="content-list__item">
                            <h2 className="title-2">Оставить заявку</h2>
                            <form action="">

                            </form>
                        </li>


                    </ul>

                </div>
            </main>
        </>
    )
}
