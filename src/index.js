import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import utility from '@ciro-maciel/utility';

import './assets/css/style.css';
import 'antd/dist/antd.min.css';

import SignUp from './containers/SignUp';
import SignIn from './containers/SignIn';
import Home from './containers/Home';

// https://www.apollographql.com/docs/react/advanced/boost-migration.html#advanced-migration
const apolloClient = new ApolloClient({
  uri: 'https://api.sorrir-viver.com.br',
  fetchOptions: {
    credentials: 'include',
  },
  request: (operation) => {
    const token = utility.navigator.cookie.get('token');
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  },
});

// https://reacttraining.com/react-router/web/guides/server-rendering/404-401-or-any-other-status
const HttpStatus = ({ code, children }) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) staticContext.status = code;
      return children;
    }}
  />
);

const NotFound = () => (
  <HttpStatus code={404}>
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  </HttpStatus>
);

// https://reacttraining.com/react-router/web/example/basic
const Routes = () => (
  // replicação para a validação do estado atual para token + user
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <Switch>
        <Route
          // exact
          path="/"
          component={(props) =>
            utility.navigator.cookie.has('token') && utility.navigator.cookie.has('user') ? (
              JSON.parse(utility.navigator.cookie.get('user')).clinic ? (
                <Home {...props} />
              ) : (
                <Redirect to="/clinic" />
              )
            ) : (
              <Redirect to="/signin" />
            )
          }
        />
        <Route
          // exact
          path="/signup"
          component={(props) =>
            utility.navigator.cookie.has('token') && utility.navigator.cookie.has('user') ? (
              <Redirect to="/" />
            ) : (
              <SignUp {...props} />
            )
          }
        />
        <Route
          // exact
          path="/signin"
          component={(props) =>
            utility.navigator.cookie.has('token') && utility.navigator.cookie.has('user') ? (
              <Redirect to="/" />
            ) : (
              <SignIn {...props} />
            )
          }
        />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  </ApolloProvider>
);
render(<Routes />, document.getElementById('container'));