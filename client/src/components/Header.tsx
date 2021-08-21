import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { UserContext } from '../context/UserContext';

const Header = () => {
  const { token, userName, isUserConnected, logOut } = useContext(UserContext);

  useEffect(() => {
    if (token) {
      jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err: VerifyErrors | null) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            console.log('TokenExpired, logging out...');
            logOut();
          }
        }
      });
    }
  });
  return (
    <div className="h-14">
      <div className="h-14 bg-gray-800">
        <div className="text-3xl font-bold text-green-500 absolute left-5">
          <Link to="/" className="text-left">
            Wamazon
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white text-center h-5 invisible lg:visible">
          The e-commerce website for the people
        </h1>
        <div className="absolute right-5 top-2">
          {isUserConnected ? (
            <div className="space-x-5 h-5">
              <Link to="/account">
                <Button variant="contained" color="secondary" size="small">
                  My Account
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={logOut}
                  size="small"
                >
                  Log Out
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-5 h-5">
              <Link to="/login" title="Login to your account">
                <Button variant="contained" color="secondary" size="small">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="contained" color="secondary" size="small">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {isUserConnected && (
        <div className="text-black text-2xl w-100 text-center mt-3 h-5">
          Hello {userName}
        </div>
      )}
    </div>
  );
};

export default Header;
