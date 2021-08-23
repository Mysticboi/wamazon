import React, { useState, useEffect, useContext } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import axios from 'axios';
import giftCard from '../../../images/giftCard.png';
import { UserContext } from '../../../context/UserContext';

const Wallet = () => (
  <div className="mt-5">
    <div className="w-2/3 mb-10 m-auto">
      <div className="relative left-9 md:left-60">
        <p className="text-3xl">Wallet</p>

        <Balance />
      </div>
    </div>
  </div>
);

const Balance = () => {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const { token } = useContext(UserContext);

  useEffect(() => {
    const getBalance = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/balance', {
          headers: {
            authorization: token,
          },
        });
        setBalance(response.data.balance);
      } catch (e) {
        console.error('Failed getBalance', e);
      }
    };

    getBalance();
  }, []);

  const handleClickOpen = () => {
    setError(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
    setKey('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  const handleConfirm = () => {
    if (key.length !== 8) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div>
      <p className="text-xl mt-5">Your balance</p>

      <div className="mt-7 w-3/4 p-3 border-2 rounded-xl border-gray-300 relative">
        <div className="flex">
          <img src={giftCard} alt="giftCard" height={40} width={40} />
          <p className="ml-2">Wamazon Gift Card Balance</p>
        </div>
        <span className="text-right absolute top-3 right-5">
          {balance.toFixed(2).replace('.', ',')} €
        </span>
        <button
          className="text-blue-600 text-sm ml-14"
          type="button"
          onClick={handleClickOpen}
        >
          Convert gift card number to balance
        </button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className="text-center">
          Gift Card
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="">
            To charge your balance using a gift card please enter the 8
            characters key figuring on it.
          </DialogContentText>
          <div className="w-70 m-auto text-center">
            <TextField
              autoFocus
              margin="dense"
              id="key"
              label="Key"
              type="text"
              value={key}
              onChange={handleChange}
              error={error}
            />
          </div>

          <div className="text-red-600 underline m-2 text-center h-5 font-bold">
            {error && 'Key should be 8 characters !'}
          </div>
        </DialogContent>
        <DialogActions className="space-x-5">
          <Button onClick={handleConfirm} color="primary" variant="outlined">
            Confirm
          </Button>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Wallet;
