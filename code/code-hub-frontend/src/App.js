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
import Search from './pages/Search';
import Hello from './pages/Hello';
import Add from './pages/Add';
import Catalogue from './pages/Catalogue'


class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/hello" component={Hello} />
          <Route path="/add" component={Add} />
          <Route path="/catalogue" component={Catalogue} />
        </Switch>
      </Router>
    );
  }
}

export default App;

// European color Blue: #004494
// Yellow: #ffd617