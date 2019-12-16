// import React, { Component } from 'react';
import React from 'react';
import './css/App.css';
import 'typeface-roboto';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from './pages/Home';
import Search from './pages/Search';
import Hello from './pages/Hello';
import Add from './pages/Add';
import Catalogue from './pages/Catalogue'
import Project from './pages/Project'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#004494'
    },
    secondary: {
      main: '#ffd617'
    }
  }
})
class App extends React.Component {

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/hello" component={Hello} />
            <Route path="/add" component={Add} />
            <Route path="/catalogue" component={Catalogue} />
            <Route path="/projects/:projectname" component={Project} />
            <Route path="/search/:searchterm" component={Search} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;

// European color Blue: #004494
// Yellow: #ffd617