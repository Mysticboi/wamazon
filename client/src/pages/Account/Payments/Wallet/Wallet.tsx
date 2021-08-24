import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  SnackbarCloseReason,
} from '@material-ui/core';
import Balance from './Balance';
import sepa from '../../../../images/sepa.jpg';

const Wallet = () => (
  <div className="mt-5">
    <div className="w-2/3 mb-10 m-auto">
      <div className="relative left-9 md:left-60">
        <p className="text-3xl">Wallet</p>

        <Balance />

        <p className="text-3xl mt-3">Add a new payment method</p>
        <div className="bg-gray-300 h-0.5 w-3/4 mt-1" />

        <AddBankAccount />
      </div>
    </div>
  </div>
);

const AddBankAccount = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleClickOpen = () => {
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleConfirm = () => {};
  return (
    <div>
      <p className="text-2xl mt-2">Add a bank account</p>
      <div className="w-2/3">
        <p>
          You will need your IBAN and BIC code to add your bank account and pay
          by direct debit. This information is present on your account statement
          or available by contacting your bank.{' '}
        </p>
      </div>
      <div className="w-3/4 relative">
        <img
          src={sepa}
          alt="sepa"
          height={120}
          width={120}
          className="absolute bottom-0 right-0"
        />
      </div>

      <button
        className="border-2 border-gray-300 text-sm rounded-lg p-1.5 mt-3 opacity-90"
        type="button"
        onClick={() => setOpen(true)}
      >
        Add your current account
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title" className="text-center">
          Add your current account
        </DialogTitle>
        <DialogContent>
          <div className="w-70 m-auto text-center">
            <TextField
              autoFocus
              margin="dense"
              id="key"
              label="Key"
              type="text"
            />
          </div>

          <DialogContentText>
            Don't use your real account bank please
          </DialogContentText>

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
    </div>
  );
};

const BankAccount = () => <div>Bank Accounts</div>;

export default Wallet;
