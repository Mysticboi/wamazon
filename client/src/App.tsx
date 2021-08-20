import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { UserContextProvider } from './context/UserContext';
import Account from './pages/Account/Account';
import Home from './pages/Home';

const App = () => (
  <UserContextProvider>
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/signup">
          <Signup />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/account">
          <Account />
        </Route>
      </Switch>
    </BrowserRouter>
  </UserContextProvider>
);

export default App;
