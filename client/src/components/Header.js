import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

const Header = () => (
  <div className="bg-gray-500 h-32">
    <div className="">
      <h2 className="text-3xl font-bold text-blue-800 text-center ">
        The e-commerce website for the people
      </h2>
    </div>

    <div className="text-white text-2xl w-100 text-center mt-2">
      Hello Walid
    </div>

    <div className="text-right w-50 space-x-10">
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
  </div>
);

export default Header;
