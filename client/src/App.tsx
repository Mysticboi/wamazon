import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Header from './components/Header';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { UserContextProvider } from './context/UserContext';
import { WishListContextProvider } from './context/WishListContext';
import Account from './pages/Account/Account';
import Home from './pages/Home/Home';
import NavBar from './components/NavBar';
import Shop from './pages/Shop';
import Marketplace from './pages/Marketplace';
import Contact from './pages/Contact';
import useIsMobile from './hooks/useIsMobile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Footer from './components/Footer';
import WishList from './pages/WishList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A548FC',
    },
  },
  overrides: {
    MuiFormControlLabel: {
      label: {
        fontSize: 14,
        fontWeight: 600,
        fontFamily:
          '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,Liberation Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
      },
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
        <WishListContextProvider>
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

              <Route path="/shop">
                <NavBar />
                <Shop />
              </Route>

              <Route path="/marketplace">
                <NavBar />
                <Marketplace />
              </Route>

              <Route path="/cart">
                <NavBar />
                <Cart />
              </Route>

              <Route path="/checkout">
                <NavBar />
                <Checkout />
              </Route>

              <Route path="/wishlist">
                <NavBar />
                <WishList />
              </Route>

              <Route path="/contact">
                <NavBar />
                <Contact />
              </Route>
            </Switch>

            <Footer />
          </BrowserRouter>
        </WishListContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  </div>
);

export default App;
