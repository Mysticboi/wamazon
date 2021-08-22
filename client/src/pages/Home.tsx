import React, { useContext } from 'react';

import { UserContext } from '../context/UserContext';

const Home = () => {
  const { isUserConnected } = useContext(UserContext);
  return (
    <div className="mt-5">
      <div className="test border-2 border-black">
        {isUserConnected ? 'Connected User' : 'Unconnected User'}
      </div>
    </div>
  );
};

export default Home;
