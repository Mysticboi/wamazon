import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const { isUserConnected } = useContext(UserContext);
  return (
    <div>
      {isUserConnected ? (
        <div>Conneceted User</div>
      ) : (
        <div>Unconnected User</div>
      )}
    </div>
  );
};

export default Home;
