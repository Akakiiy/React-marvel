import PropTypes from 'prop-types';
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";

import Spinner from "../spiner/Spinner";
import './charList.scss';

import {useState, useEffect, useRef} from "react";

const CharList = (props) => {

    const [characterList, setCharacterList] = useState([]),
          [loading, setLoading] = useState(true),
          [error, setError] = useState(false),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(210),
          [maxOffset, setMaxOffset] = useState(1562);


    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, []);

    const onRequest = (offset) => {
        onLoadingNewCharacters();

        marvelService.getAllCharacters(offset)
            .then(onCharactersInState)
            .catch(onError);
    }

    const onCharactersInState = (res) => {
        setCharacterList(characterList => [...characterList, ...res]);
        setLoading(false);
        setError(false);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
    }

    const onLoadingNewCharacters = () => {
            setNewItemLoading(true);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item-selected'));
        itemRefs.current[id].classList.add('char__item-selected');
        itemRefs.current[id].focus();
    }

    function renderItems (arr) {
        const characterCards = arr.map((item, i) => {
            return (
                <li
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onSelectedChar(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}>
                    <img
                        style={item.thumbnail.indexOf('image_not_available') > 0 ? {objectFit: 'fill'} : {objectFit: 'cover'}}
                        src={item.thumbnail} alt="abyss"/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {characterCards}
            </ul>
        )
    }

    const items = renderItems(characterList);

    const errorMessage = error ? <ErrorMessage/> : null,
          loadingMessage = loading ? <Spinner/> : null,
          content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {loadingMessage}
            {content}
            <button
                style={{'display': offset >= maxOffset ? 'none' : 'block'}}
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func.isRequired,
}


export default CharList;