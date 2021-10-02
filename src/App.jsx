import React from "react";
import {  BrowserRouter as Router,  Switch,  Route,  Link} from "react-router-dom";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import RegPage from "./pages/RegPage";

function App() {
  return (  
      <Router>
          <Switch>
              <Route exact path="/" component={LoginPage} />
              <Route exact path="/game" component={GamePage} />
              <Route exact path="/register" component={RegPage} />
          </Switch>            
      </Router>         
  );
}

export default App;
