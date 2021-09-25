import React from "react";
import {  BrowserRouter as Router,  Switch,  Route,  Link} from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/" component={MainPage}/>
          <Route path="/login" component={LoginPage}/>           

        </Switch>
    </Router>
  );
}



export default App;
