import PropTypes from 'prop-types';
import ErrorMessage from "../errorMessage/ErrorMessage";

import Spinner from "../spiner/Spinner";
import './charList.scss';

import {useState, useEffect, useRef} from "react";
import useMarvelService from "../../services/MarvelService";

const CharList = (props) => {

    const [characterList, setCharacterList] = useState([]),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(210),
          [maxOffset, setMaxOffset] = useState(1562);

    const {getAllCharacters, error, loading} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharactersInState);
    }

    const onCharactersInState = (res) => {
        setCharacterList(characterList => [...characterList, ...res]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
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
                            props.onSelectedChar(item.id);
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
          loadingMessage = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {loadingMessage}
            {items}
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