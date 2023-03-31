import {Component} from "react";
import PropTypes from 'prop-types';

import './charInfo.scss';
import MarvelService from "../../services/MarvelService";
import Skeleton from "../skeleton/Skeleton";
import Spinner from "../spiner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharInfo extends Component {

    state = {
        char : null,
        loading: false,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps){
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }
        this.onCharLoading();

        this.marvelService.getCharacter(charId)
            .then(this.onCharacterUploaded)
            .catch(this.onError)
    }

    onCharacterUploaded = (char) => {
        this.setState({
            char: char,
            loading: false
        });
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }
    render() {
        const {char, loading, error} = this.state;

        const skeleton =  loading || error || char ? null : <Skeleton/> ,
              loadingMessage = loading ? <Spinner/> : null,
              errorMessage = error ? <ErrorMessage/> : null,
              content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {loadingMessage}
                {errorMessage}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    return (
        <>
            <div className="char__basics">
                <img
                    src={thumbnail}
                    style={thumbnail.indexOf('image_not_available') > 0 ? {objectFit: 'contain'} : {objectFit: 'cover'}}
                    alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">Homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        if (i > 9) return;

                        return (
                            <li
                                key={i}
                                className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.proopTypes = {
    charId: PropTypes.number,
}

export default CharInfo;