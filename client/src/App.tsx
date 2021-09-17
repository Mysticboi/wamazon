import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import Header from './components/Header';
import Footer from './components/Footer';
import FallBack from './components/FallBack';
import useIsMobile from './hooks/useIsMobile';

const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Account = lazy(() => import('./pages/Account/Account'));
const Home = lazy(() => import('./pages/Home/Home'));
const NavBar = lazy(() => import('./components/NavBar'));
const Shop = lazy(() => import('./pages/Shop'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const WishList = lazy(() => import('./pages/WishList'));
const Product = lazy(() => import('./pages/Product'));

import { UserContextProvider } from './context/UserContext';
import { WishListContextProvider } from './context/WishListContext';
import { CartContextProvider } from './context/CartContext';

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
          <CartContextProvider>
            <BrowserRouter>
              <Header />
              <Suspense fallback={<FallBack />}>
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

                  <Route path="/product/:productId">
                    <NavBar />
                    <Product />
                  </Route>

                  <Route path="/contact">
                    <NavBar />
                    <Contact />
                  </Route>
                </Switch>
              </Suspense>

              <Footer />
            </BrowserRouter>
          </CartContextProvider>
        </WishListContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  </div>
);

export default App;
