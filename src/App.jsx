import React from "react";
import {  BrowserRouter as Router,  Switch,  Route } from "react-router-dom";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import RegPage from "./pages/RegPage";
import GameMenuPage from "./pages/GameMenuPage";

function App() {
  return (  
      <Router>
          <Switch>
              <Route exact path="/" component={LoginPage} />
              <Route exact path="/game" component={GamePage} />
              <Route exact path="/register" component={RegPage} />
              <Route exact path="/main" component={GameMenuPage} />
          </Switch>            
      </Router>         
  );
}

export default App;
