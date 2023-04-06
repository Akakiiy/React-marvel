import {Link} from "react-router-dom";
import './404.scss';

const Page404 = () => {
    return (
        <div className={'page404'}>
            <figure>
                <img className={'page404__img'} src="https://media.tenor.com/NO-VMbySFSoAAAAM/gosling.gif" alt="ryan gosling watching on your URL adress"/>
            </figure>
            <div>
                <h2 className={'page404__title'}>К сожалению такого адресса не существует</h2>
                <Link className={'page404__back'} to={'/'}>Вернуться на главную страницу</Link>
            </div>
        </div>
    )
}

export default Page404;