import React from "react";
import {  BrowserRouter as Router,  Switch,  Route } from "react-router-dom";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import RegPage from "./pages/RegPage";
import GameMenuPage from "./pages/GameMenuPage";
import TestPage from "./pages/TestPage";

function App() {
  return (  
      <Router>
          <Switch>
              <Route exact path="/" component={LoginPage} />
              <Route exact path="/game" component={GamePage} />
              <Route exact path="/register" component={RegPage} />
              <Route exact path="/main" component={GameMenuPage} />
              <Route exact path="/test" component={TestPage} />
          </Switch>            
      </Router>         
  );
}

export default App;
