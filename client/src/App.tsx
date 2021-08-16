import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { UserContextProvider } from './context/UserContext';
import Account from './pages/Account/Account';
import Home from './pages/Home';

function App() {
  return (
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
}

export default App;
