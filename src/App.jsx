import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import GamesPage from "./pages/GamesPage";
import GamePage from "./pages/GamePage";
import PlayPage from "./pages/PlayPage";
import { CommentsStore } from "./models/comment";

const commentsStore = CommentsStore.create({
});

function App() {
    return (  
        <Router>
            <Switch>
                <Route exact path="/signin" component={SignInPage} />
                <Route exact path="/signup" component={SignUpPage} />
                <Route exact path="/games" component={GamesPage} />
                <Route exact path="/games/:gameId" component={GamePage} />
                <Route exact path="/games/:gameId/play" component={PlayPage} />
            </Switch>            
        </Router>         
    );
}

export default App;
