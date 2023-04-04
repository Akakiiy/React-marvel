import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spiner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import {useState, useEffect} from "react";

const RandomChar = () => {

    const [char, setChar] = useState({});

   const {loading, error, getCharacter, clearError} = useMarvelService();

   useEffect(() => {
       updateChar();
       const timeId = setInterval(updateChar, 60000);

       return () => {
           clearInterval(timeId);
       }
   }, []);

    const onCharacterUploaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            .then(onCharacterUploaded);
    }

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
                    <div onClick={updateChar} className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
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

    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    return (
        <div className="randomchar__block">
            <img style={imgStyle} src={thumbnail} alt="Random character" className="randomchar__img"/>
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