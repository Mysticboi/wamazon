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
    <div className="bg-gray-500 h-24">
      <div className="text-3xl font-bold text-green-400 h-0 absolute left-5">
        <Link to="/" className="text-left">
          Wamazon
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-blue-800 text-center h-5">
        The e-commerce website for the people
      </h1>

      {isUserConnected && (
        <div className="text-white text-2xl w-100 text-center mt-3 h-5">
          Hello {userName}
        </div>
      )}
      {isUserConnected ? (
        <div className="text-right mr-5 space-x-5 h-5">
          <Link to="/account">
            <Button variant="contained" color="secondary">
              My Account
            </Button>
          </Link>
          <Link to="/">
            <Button variant="contained" color="secondary" onClick={logOut}>
              Log Out
            </Button>
          </Link>
        </div>
      ) : (
        <div className="text-right w-50 space-x-10 mr-5 h-5 mt-7">
          <Link to="/login" title="Login to your account">
            <Button variant="contained" color="secondary">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="contained" color="secondary">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
