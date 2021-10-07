import React from "react";
import {  BrowserRouter as Router,  Switch,  Route } from "react-router-dom";
import GamePage from "./pages/GamePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import GameMenuPage from "./pages/GameMenuPage";
import TestPage from "./pages/TestPage";

function App() {
  return (  
      <Router>
          <Switch>
              <Route exact path="/signin" component={SignInPage}/>
              <Route exact path="/game" component={GamePage}/>
              <Route exact path="/signup" component={SignUpPage}/>
              <Route exact path="/main" component={GameMenuPage} />
              <Route exact path="/test" component={TestPage} />
          </Switch>            
      </Router>         
  );
}

export default App;
