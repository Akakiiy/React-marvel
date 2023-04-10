import {lazy, Suspense} from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import AppHeader from "../appHeader/AppHeader";
import FindedCharPage from "../pages/findedCharPage/FindedCharPage";
import Spinner from "../spiner/Spinner";
import CharFindingForm from "../charFindingForm/CharFindingForm";

const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/singleComicPage/SingleComicPage'));
const Page404 = lazy(() => import('../pages/404/404'));


const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Switch>
                            <Route exact path="/">
                                <MainPage/>
                            </Route>
                            <Route exact path="/comics">
                                <ComicsPage/>
                            </Route>
                            <Route exact path={'/comics/:comicId'}>
                                <SingleComicPage/>
                            </Route>
                            <Route exact path={"/characters/:id"}>
                                <FindedCharPage/>
                            </Route>
                            <Route path={"*"}>
                                <Page404/>
                            </Route>
                        </Switch>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;