import React from 'react';
import { CircularProgress } from '@material-ui/core';

const FallBack = () => (
  <div className="h-96 w-full flex justify-center items-center">
    <CircularProgress color="primary" size={20} />
  </div>
);

export default FallBack;
