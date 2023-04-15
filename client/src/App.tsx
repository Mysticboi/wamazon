import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
                <Routes>
                  <Route
                    path="/*"
                    element={
                      <>
                        <NavBar />
                        <Home />
                      </>
                    }
                  />
                  <Route path="/signup" element={<Signup />} />

                  <Route path="/login" element={<Login />} />

                  <Route
                    path="/account"
                    element={
                      <>
                        <NavBar />
                        <Account />
                      </>
                    }
                  />

                  <Route
                    path="/shop"
                    element={
                      <>
                        <NavBar />
                        <Shop />
                      </>
                    }
                  />

                  <Route
                    path="/marketplace"
                    element={
                      <>
                        <NavBar />
                        <Marketplace />
                      </>
                    }
                  />

                  <Route
                    path="/cart"
                    element={
                      <>
                        <NavBar />
                        <Cart />
                      </>
                    }
                  />

                  <Route
                    path="/checkout"
                    element={
                      <>
                        <NavBar />
                        <Checkout />
                      </>
                    }
                  />

                  <Route
                    path="/wishlist"
                    element={
                      <>
                        <NavBar />
                        <WishList />
                      </>
                    }
                  />

                  <Route
                    path="/product/:productId"
                    element={
                      <>
                        {' '}
                        <NavBar />
                        <Product />
                      </>
                    }
                  />

                  <Route
                    path="/contact"
                    element={
                      <>
                        <NavBar />
                        <Contact />
                      </>
                    }
                  />
                </Routes>
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
