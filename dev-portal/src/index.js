// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

// content-fragments (import here to start this ASAP)
import 'services/get-fragments'

// semantic-ui
import 'semantic-ui-css/semantic.css'

// pages
import Home from 'pages/Home'
import GettingStarted from 'pages/GettingStarted'
import Dashboard from 'pages/Dashboard'
import Apis from 'pages/Apis'
import { Admin } from 'pages/Admin'

// components
import AlertPopup from 'components/AlertPopup'
import GlobalModal from 'components/Modal'
import NavBar from 'components/NavBar'
import Feedback from './components/Feedback'
import ApiSearch from './components/ApiSearch'

import { isAdmin, init, login, logout } from 'services/self'
import './index.css';

// TODO: Feedback should be enabled if
// the following is true && the current
// user is not an administrator
const feedbackEnabled = window.config.feedbackEnabled

export const AdminRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    isAdmin()
      ? <Component {...props} />
      : <Redirect to="/" />
  )} />
)

class App extends React.Component {
  constructor() {
    super()
    init()

    // We are using an S3 redirect rule to prefix the url path with #!
    // This then converts it back to a URL path for React routing
    if (window.location.hash && window.location.hash[1] === '!') {
      const hashRoute = window.location.hash.substring(2)
      window.history.pushState({}, 'home page', hashRoute)
    }
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <NavBar />
          <GlobalModal />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/getting-started" component={GettingStarted} />
            <Route path="/dashboard" component={Dashboard} />
            <AdminRoute path="/admin" component={Admin} />
            <Route exact path="/apis" component={Apis} />
            <Route exact path="/apis/search" component={ApiSearch} />
            <Route exact path="/apis/:apiId" component={Apis}/>
            <Route path="/apis/:apiId/:stage" component={Apis} />
            <Route path="/login" render={() => { login(); return <Redirect to="/" /> }} />
            <Route path="/logout" render={() => { logout(); return <Redirect to="/" /> }} />
            <Route component={() => <h2>Page not found</h2>} />
          </Switch>
          {feedbackEnabled && <Feedback />}
          <AlertPopup />
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
