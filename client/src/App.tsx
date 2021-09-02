import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Header from './components/Header';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { UserContextProvider } from './context/UserContext';
import Account from './pages/Account/Account';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import useIsMobile from './hooks/useIsMobile';
import Contact from './pages/Contact';

const theme = createTheme({
  palette: {
    primary: {
      main: '#a749ff',
    },
  },
});

const App = () => {
  const isMobile = useIsMobile();
  return (
    <div>
      {isMobile ? (
        <div className="test border-2 border-black rounded-xl text-center mt-20">
          Not supporting mobile
        </div>
      ) : (
        <AppDesktop />
      )}
    </div>
  );
};

const AppDesktop = () => (
  <div className="font-serif">
    <ThemeProvider theme={theme}>
      <UserContextProvider>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/">
              <NavBar />
              <Home />
            </Route>

            <Route path="/signup">
              <Signup />
            </Route>

            <Route path="/login">
              <Login />
            </Route>

            <Route path="/account">
              <NavBar />
              <Account />
            </Route>

            <Route path="/contact">
              <Contact />
            </Route>
          </Switch>
        </BrowserRouter>
      </UserContextProvider>
    </ThemeProvider>
  </div>
);

export default App;
