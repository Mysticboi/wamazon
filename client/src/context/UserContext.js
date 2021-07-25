import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token');
  const storedName = localStorage.getItem('name');
  const [token, setTokenState] = useState(storedToken);
  const [userName, setUserNameState] = useState(storedName);

  const setToken = (token) => {
    localStorage.setItem('token', token);
    setTokenState(token);
  };

  const setUserName = (name) => {
    localStorage.setItem('name', name);
    setUserNameState(name);
  };

  const isUserConnected = !!token;

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setTokenState(null);
    setUserNameState(null);
  };
  const userContext = {
    token,
    setToken,
    userName,
    setUserName,
    isUserConnected,
    logOut,
  };

  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};
