import React, { useState, useEffect } from 'react';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);

  return (
    <div className="mt-5">
      <p className="text-4xl text-center mb-10">My Addresses</p>
    </div>
  );
};

export default Addresses;
