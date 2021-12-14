import React from "react";
import { 
    Router, 
    Switch, 
    Route 
} from "react-router-dom";
import { createBrowserHistory } from "history";

import MainPage from "./pages/MainPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import GamesPage from "./pages/GamesPage";
import GamePage from "./pages/GamePage";
import PlayPage from "./pages/PlayPage";
import LoadPage from "./pages/LoadPage";
import { NotFoundPage } from "./pages/error";
import { MainLayout } from "./layouts";

const history = createBrowserHistory();
history.listen((location) => {
    window.ym(86784357, "hit", location.pathname);
});

function App() {
    return (
        <Router history={history}>
            <MainLayout>
                <Switch>
                    <Route exact path="/" component={MainPage} />
                    <Route exact path="/signin" component={SignInPage} />
                    <Route exact path="/signup" component={SignUpPage} />
                    <Route exact path="/games" component={GamesPage} />
                    <Route exact path="/games/load" component={LoadPage} />
                    <Route exact path="/games/:gameId" component={GamePage} />
                    <Route exact path="/games/:gameId/play" component={PlayPage} />
                    <Route exact path="/404" component={NotFoundPage} />
                </Switch>
            </MainLayout>
        </Router>
    );
}

export default App;
