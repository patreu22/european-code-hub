// import React, { Component } from 'react';
import React from 'react';
import './css/App.css';
import 'typeface-roboto';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './pages/Home';


class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/"><Home /></Route>
          {/* <Route path="/profile"><UserProfile /></Route>
          <Route path="/browse"><ProjectBrowser /></Route> */}
        </Switch>
      </Router>
    );
  }
}

export default App;
