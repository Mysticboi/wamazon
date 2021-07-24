import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/">
          Home
        </Route>

        <Route path="/signup">
          <Signup />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
