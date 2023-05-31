import React, { useEffect, useState } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import { observer } from "mobx-react-lite";

import MainPage from "./pages/MainPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import GamesPage from "./pages/GamesPage";
import UnpublicatedGamesPage from "./pages/UnpublicatedGamesPage";
import GamePage from "./pages/GamePage";
import PlayPage from "./pages/PlayPage";
import GamePublishPage from "./pages/GamePublishPage";
import UserProfilePage from "./pages/UserProfilePage";
import LibraryPage from "./pages/LibraryPage";
import ProjectPage from "./pages/ProjectPage";
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

    useEffect(() => {
        store.initialize().catch((err) => console.error(err));
    }, []);

    return (
        <Router history={history}>
            <MainLayout>
                <Switch>
                    <Route exact path="/" component={MainPage} />
                    <Route exact path="/signin" component={SignInPage} />
                    <Route exact path="/signup" component={SignUpPage} />
                    <Route exact path="/games" component={GamesPage} />              
                    <Route exact path="/games/new">
                        <GamePublishPage history={history} />
                    </Route>
                    <Route exact path="/games/unpublicated">
                        <UnpublicatedGamesPage history={history} />
                    </Route>
                    <Route exact path="/games/:gameId" component={GamePage} />
                    <Route exact path="/games/:gameId/play" component={PlayPage} />               
                    <Route exact path="/users/:userId">
                        <UserProfilePage history={history}/>
                    </Route>
                    <Route exact path="/404" component={NotFoundPage} />
                    <Route exact path="/project/:userId" component={ProjectPage} />      
                    <Route exact path="/library" component={LibraryPage} /> 
                </Switch>
            </MainLayout>
        </Router>
    );
}

export default App;
// export default observer(App);
