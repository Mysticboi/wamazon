import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Header = () => {
  const { token, userName, isUserConnected, logOut } = useContext(UserContext);

  useEffect(() => {
    const verifyTokenExpired = async () => {
      try {
        await axios.get('http://localhost:5000/user/verifyToken', {
          headers: {
            authorization: token,
          },
        });

        console.log('Unexpired token');
      } catch (e) {
        const errorMessage = e.response?.data.message;
        if (errorMessage === 'Expired token') {
          console.log('Token expired logging out...');
          logOut();
        }
      }
    };

    if (token) {
      verifyTokenExpired();
    }
  });
  return (
    <div className="h-14">
      <div className="h-14 bg-gray-800">
        <div className="text-3xl font-bold text-purple-500 absolute left-5">
          <Link to="/" className="text-left">
            Wamazon
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white text-center h-5 invisible xl:visible">
          The e-commerce website for the people
        </h1>

        {isUserConnected && (
          <div className="text-white text-lg absolute top-2 right-60 border-2 p-0.5 border-dotted border-white sm:visible invisible">
            <p>Hello {userName}</p>
          </div>
        )}
        <div className="absolute right-5 top-2">
          {isUserConnected ? (
            <div className="space-x-5 h-5">
              <Link to="/account">
                <Button variant="contained" color="primary" size="small">
                  My Account
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="contained"
                  color="primary"
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
                <Button variant="contained" color="primary" size="small">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="contained" color="primary" size="small">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
