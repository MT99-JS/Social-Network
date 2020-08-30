import React, { Fragment } from "react";
import { NavBar } from "./components/Layout/NavBar";
import { Landing } from "./components/Layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <Fragment>
        <NavBar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
           <Route exact path='/login' component={Login}/>
           <Route exact path='/register' component={Register}/>
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
}

export default App;
