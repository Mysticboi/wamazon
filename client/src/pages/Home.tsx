import React, { useContext, useEffect } from 'react';

import { UserContext } from '../context/UserContext';

const Home = () => {
  const { isUserConnected } = useContext(UserContext);

  useEffect(() => {
    document.title = 'Wamazon';
  }, []);

  return (
    <div>
      <div className="mt-5 w-80 m-auto">
        <div className="test border-2 border-black rounded-xl">
          {isUserConnected ? 'Connected User' : 'Unconnected User'}
        </div>
      </div>
    </div>
  );
};

export default Home;
