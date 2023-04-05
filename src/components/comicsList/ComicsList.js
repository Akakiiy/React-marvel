import './comicsList.scss';
import useMarvelService from "../../services/MarvelService";
import {useEffect, useState} from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spiner/Spinner";

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]),
          [newComicsLoading, setNewComicsLoading] = useState(false),
          [offset, setOffset] = useState(0),
          [ended, setEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, interval = false) => {
        interval ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded);
    }

    const onComicsListLoaded = (newComicsArr) => {
        let ended = false;
        if (newComicsArr.length < 8) {
            ended = true;
        }
        setComicsList(comicsArr => [...comicsArr, ...newComicsArr]);
        setNewComicsLoading(false);
        setOffset(offset => offset + 8);
        setEnded(ended);
    }

    function renderItems (arr) {
        const newComics = arr.map((item, i) => {
            return (
                <li key={i} className="comics__item">
                    <a href={"#"}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        });
        return (
            <ul className="comics__grid">
                {newComics}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null,
          loadingMessage = loading && !newComicsLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {loadingMessage}
            {items}
            <button
                style={{"display": ended ? 'node' : 'block'}}
                disabled={newComicsLoading}
                onClick={() => onRequest(offset)}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;