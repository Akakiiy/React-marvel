import './CharFindingForm.scss';

import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import {useState} from "react";
import {Link} from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";


const CharFindingForm = () => {
    const [char, setChar] = useState(null);

    const {loading, error, getCharacterByName, clearError} = useMarvelService();

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        console.log(name);
        clearError();


        getCharacterByName(name)
            .then(onCharLoaded)
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;
    const results = !char ? null : char.length > 0 ?
        <div className="char__search-wrapper">
            <div className="char__search-success">There is! Visit {char[0].name} page?</div>
            <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                <div className="inner">To page</div>
            </Link>
        </div> :
        <div className="char__search-error">
            The character was not found. Check the name and try again
        </div>;

    return (
        <div className={'form-container'}>
            <h2 className={'form-label'}>Or find a character by name:</h2>
            <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={{
                    charName: ''
                }}
                validationSchema={Yup.object({
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit={({charName}) => {
                    updateChar(charName)
                }}
            >
                <Form className={'form'}>
                    <Field
                        id={"charName"}
                        className={'form-input'}
                        type="text"
                        name="charName"
                        placeholder="Enter name"/>
                    <button className="button button__main" type="submit" disabled={loading}>
                        <div className="inner">find</div>
                    </button>
                    <FormikErrorMessage className={'form-error'} name="charName" component="div" />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
};

export default CharFindingForm;