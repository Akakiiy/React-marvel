import AppBanner from "../../appBanner/AppBanner";
import './FindedCharPage.scss';
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import useMarvelService from "../../../services/MarvelService";
import ErrorMessage from "../../errorMessage/ErrorMessage";
import Spinner from "../../spiner/Spinner";

const FindedCharPage = () => {

    const {id} = useParams();
    const [data, setData] = useState(null);

    const {loading, error, getComic, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateData()
    }, [id])

    const updateData = () => {
        clearError();

        getCharacter(id)
            .then(onDataLoaded);
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !data) ? <Component data={data}/> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    );
};

const Component = ({data}) => {
    const {name, thumbnail, description} = data;
    return (
        <div className="single-char">
            <img src={thumbnail} alt={name} className="single-char__img"/>
            <div className="single-char__info">
                <h2 className="single-char__name">{name}</h2>
                <p className="single-char__descr">{description}</p>
            </div>
        </div>
    )
}

export default FindedCharPage;