// import React, { Component } from 'react';
import React from 'react';
import './css/App.css';
import 'typeface-roboto';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { LastLocationProvider } from 'react-router-last-location';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { setVerificationCookieAndProfileImageAndUserNameInStore } from './actions/httpActions'
import { getVerificationToken } from './helper/cookieHelper'
import { HOME, ADD, VERIFY, CONTRIBUTE, SEARCH, LOGIN, REGISTER, USER, PROJECTS, PROFILE, ADD_VIA_GITHUB, ADD_VIA_JSON, ADD_MANUALLY } from './routes'
import Home from './pages/Home';
import Search from './pages/Search';
import AddDefault from './pages/Add/AddDefault';
import AddViaGithub from './pages/Add/AddViaGithub'
import AddViaJson from './pages/Add/AddViaJson'
import AddManually from './pages/Add/AddManually'
import Catalogue from './pages/Catalogue'
import Project from './pages/Project'
import Login from './pages/Login'
import Register from './pages/Register'
import Contribute from './pages/Contribute'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Verify from './pages/Verify'

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

  componentDidMount() {
    const token = getVerificationToken()
    if (token) {
      this.props.setVerificationCookieAndProfileImageAndUserNameInStore(token)
    }
  }

  render() {
    console.log("Test!")
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <MuiThemeProvider theme={theme}>
          <Router>
            <LastLocationProvider>
              <Switch>
                <Route exact path={HOME} component={Home} />
                <Route path={ADD_VIA_JSON} component={AddViaJson} />
                <Route path={ADD_VIA_GITHUB} component={AddViaGithub} />
                <Route path={ADD_MANUALLY} component={AddManually} />
                <Route path={ADD} component={AddDefault} />
                <Route path={CONTRIBUTE} component={Contribute} />
                <Route path={SEARCH} component={Search} />
                <Route path={LOGIN} component={Login} />
                <Route path={REGISTER} component={Register} />
                <Route path={`${USER}/:username?`} component={Profile} />
                <Route path={`${PROFILE}/:username?`} component={Profile} />
                <Route path={`${PROJECTS}/:projectname`} component={Project} />
                <Route path={PROJECTS} component={Catalogue} />
                <Route path={`${VERIFY}`} component={Verify} />
                <Route component={NotFound} />
              </Switch>
            </LastLocationProvider>
          </Router>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = { setVerificationCookieAndProfileImageAndUserNameInStore }

export default connect(mapStateToProps, mapDispatchToProps)(App);

// European color Blue: #004494
// Yellow: #ffd617