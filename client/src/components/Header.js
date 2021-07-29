import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { UserContext } from '../context/UserContext';

const Header = () => {
  const { userName, isUserConnected, logOut } = useContext(UserContext);
  return (
    <div className="bg-gray-500 h-32">
      <h2 className="text-3xl font-bold text-blue-800 text-center">
        The e-commerce website for the people
      </h2>

      {isUserConnected && (
        <div className="text-white text-2xl w-100 text-center mt-2">
          Hello {userName}
        </div>
      )}
      {isUserConnected ? (
        <div className="text-right mr-5 space-x-5">
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
        <div className="text-right w-50 space-x-10 mt-10 mr-5">
          <Link to="/login">
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
