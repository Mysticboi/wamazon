import React from 'react';
import { useParams } from 'react-router-dom';

const UpdateAddress = () => {
  const { addressId } = useParams();

  return (
    <div className="mt-5">
      <p className="text-4xl text-center mb-10">Editing Address</p>{' '}
    </div>
  );
};

export default UpdateAddress;
