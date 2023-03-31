import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spiner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import {Component} from "react";

class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false,
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
        // this.timeId = setInterval(this.updateChar, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timeId);
    }

    onCharacterUploaded = (char) => {
        this.setState({
            char,
            loading: false,
            error: false,
        });
    }

    onCharLoading = () => {
        this.setState({
            loading: true,
            error: false,
        });
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharacterUploaded)
            .catch(this.onError);
    }

    render() {
        const {char, loading, error} = this.state

        const spiner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {spiner}
                {errorMessage}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div onClick={this.updateChar} className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;

    const onCheckAndFixDescription = (descr) => {
        const maxTextExample = 'As the Norse God of thunder and lightning, Thor wields one of the greatest weapons ever made, the enchanted hammer Mjolnir. While others have described Thor as an over-muscled, oafi...';

        if (!descr) {
            return 'Right now, there is no info about this character :(';
        } else if (descr.length > maxTextExample.length) {
            return descr.slice(0, maxTextExample.length - 3) + '(learn more on wiki)'
        } else {
            return descr
        }
    }

    return (
        <div className="randomchar__block">
            <img style={thumbnail.indexOf('image_not_available') > 0 ? {objectFit: 'contain'} : {objectFit: 'cover'}} src={thumbnail} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {onCheckAndFixDescription(description)}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;