import React, { useState, useEffect, useContext } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  SnackbarCloseReason,
} from '@material-ui/core';
import axios from 'axios';
import { Alert } from '@material-ui/lab';
import giftCard from '../../../../images/giftCard.png';
import { UserContext } from '../../../../context/UserContext';

const Balance = () => {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(0);
  const [successGiftCard, setSuccessGiftCard] = useState(false);
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
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setKey('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  const handleConfirm = async () => {
    if (key.length !== 8) {
      setError('Key should be 8 characters !');
    } else {
      try {
        const response = await axios.put(
          `http://localhost:5000/giftCard/${key}`,
          {},
          {
            headers: {
              authorization: token,
            },
          }
        );
        setError('');
        setBalance((prevBalance) => prevBalance + response.data.value);
        setOpen(false);
        setSuccessGiftCard(true);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const status = e.response?.status;
          if (status === 400) {
            setError('Gift card has already been used');
          } else if (status === 404) {
            setError('Invalid key');
          }
        }
      }
    }
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'timeout') {
      setSuccessGiftCard(false);
    }
  };

  return (
    <div>
      <p className="text-xl mt-5">Your balance</p>

      <div className="mt-5 w-3/4 p-3 border-2 rounded-xl border-gray-300 relative">
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
              error={!!error}
              color="primary"
            />
          </div>

          <div className="text-red-600 underline m-2 text-center h-5 font-bold">
            {error}
          </div>
        </DialogContent>
        <DialogActions className="space-x-5">
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Confirm
          </Button>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successGiftCard}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Success converting gift card
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Balance;
