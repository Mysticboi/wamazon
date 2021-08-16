import React, { createContext, useState } from 'react';

type IUserContext = {
  token: string | null;
  setToken: (token: string) => void;
  userName: string | null;
  setUserName: (userName: string) => void;
  isUserConnected: boolean;
  logOut: () => void;
};

export const UserContext = createContext<IUserContext>({
  token: '',
  setToken: () => {},
  userName: '',
  setUserName: () => {},
  isUserConnected: false,
  logOut: () => {},
});

export const UserContextProvider: React.FC = ({ children }) => {
  const storedToken = localStorage.getItem('token');
  const storedName = localStorage.getItem('name');
  const [token, setTokenState] = useState(storedToken);
  const [userName, setUserNameState] = useState(storedName);

  const setToken = (token: string) => {
    localStorage.setItem('token', token);
    setTokenState(token);
  };

  const setUserName = (name: string) => {
    localStorage.setItem('name', name);
    setUserNameState(name);
  };

  const isUserConnected: boolean = !!token;

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
