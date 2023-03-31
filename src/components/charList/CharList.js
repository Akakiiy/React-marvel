import PropTypes from 'prop-types';
import MarvelService from "../../services/MarvelService";
import {Component} from "react";

import './charList.scss';
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spiner/Spinner";



class CharList extends Component {

    state = {
        characterList : [],
        loading: true,
        error: false,
        newItemLoading : false,
        offset: 210,
        maxOffset: 1562,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onLoadingNewCharacters();

        this.marvelService.getAllCharacters(offset)
            .then(this.onCharactersInState)
            .catch(this.onError);
    }

    onCharactersInState = (res) => {
        this.setState(({characterList, offset}) => ({
            characterList : [...characterList, ...res],
            loading: false,
            error: false,
            newItemLoading : false,
            offset: offset + 9,
        }));
    }

    onLoadingNewCharacters = () => {
        this.setState({
            newItemLoading: true,
        });
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        });
    }

    renderItems = (arr) => {
        const characterCards = arr.map(item => {
            return (
                <li
                    className="char__item"
                    key={item.id}
                    onClick={() => this.props.onSelectedChar(item.id)}>
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

    render () {
        const {characterList, loading, error, newItemLoading, offset, maxOffset} = this.state

        const items = this.renderItems(characterList);

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
                    onClick={() => this.onRequest(offset)}
                    className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func.isRequired,
}


export default CharList;