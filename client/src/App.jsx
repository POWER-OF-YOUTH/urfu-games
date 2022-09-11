import React, { useEffect, useState } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { observer } from "mobx-react-lite";

import MainPage from "./pages/MainPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import GamesPage from "./pages/GamesPage";
import GamePage from "./pages/GamePage";
import PlayPage from "./pages/PlayPage";
import GamePublishPage from "./pages/GamePublishPage";
import { NotFoundPage } from "./pages/error";
import { MainLayout } from "./layouts";
import useStore from "./hooks/useStore";

import * as globals from "./globals";

const history = createBrowserHistory();

if (process.env.NODE_ENV === "production") {
    history.listen((location) => {
        window.ym(globals.YM_ID, "hit", location.pathname);
    });
}

function App() {
    const store = useStore();

    /** Состояние, сообщающее о том, ициализировано ли приложение. */
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        store.initialize()
            .then(() => setInitialized(true))
            .catch((err) => console.error(err));
    }, []);

    return (
        <Router history={history}>
            {initialized && (
                <MainLayout>
                    <Switch>
                        <Route exact path="/" component={MainPage} />
                        <Route exact path="/signin">
                            {!store.auth.authenticated ? <SignInPage history={history} /> : <Redirect to="/" />}
                        </Route>
                        <Route exact path="/signup">
                            {!store.auth.authenticated ? <SignUpPage history={history} /> : <Redirect to="/" />}
                        </Route>
                        <Route exact path="/games" component={GamesPage} />
                        <Route exact path="/games/new">
                            {store.auth.authenticated ? <GamePublishPage history={history} /> : <Redirect to="/" />}
                        </Route>
                        <Route exact path="/games/:gameId" component={GamePage} />
                        <Route exact path="/games/:gameId/play" component={PlayPage} />
                        <Route exact path="/404" component={NotFoundPage} />
                    </Switch>
                </MainLayout>
            )}
        </Router>
    );
}

export default observer(App);
