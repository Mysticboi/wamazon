import React, { useState, useContext } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  SnackbarCloseReason,
} from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { Alert } from '@material-ui/lab';
import axios from 'axios';
import { UserContext } from '../../../../context/UserContext';

import sepa from '../../../../images/sepa.jpg';

type Values = {
  iban: string;
  bic: string;
  holder: string;
};

type Error = Partial<Values>;

const AddBankAccount = () => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Error>({});
  const [success, setSuccess] = useState(false);
  const { token } = useContext(UserContext);

  const handleClickOpen = () => {
    // setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // setError('');
  };

  const onSubmit = async (values: Values) => {
    const { iban, bic, holder } = values;

    const finalErrors: Error = {};

    if (!iban || iban.length < 20 || iban.length > 34) {
      finalErrors.iban = 'Between 20 and 34 characters';
    }
    if (!bic || (bic.length !== 8 && bic.length !== 11)) {
      finalErrors.bic = '8 or 11 characters';
    }
    if (!holder || holder.split(' ').length < 2) {
      finalErrors.holder = '2 words';
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      const data = { iban, bic, holder };
      try {
        await axios.post('http://localhost:5000/bankAccount', data, {
          headers: {
            authorization: token,
          },
        });

        setOpen(false);
        setSuccess(true);
      } catch (error) {
        console.error('Failed creating bank account', error);
        setErrors({ iban: 'Iban already related to existing account' });
      }
    }
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'timeout') {
      setSuccess(false);
    }
  };
  return (
    <div>
      <p className="text-2xl mt-2">Add a bank account</p>
      <div className="w-3/4">
        <p className="w-3/4 text-sm">
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
        onClick={handleClickOpen}
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
          <div className="flex justify-center mt-10 border-2 shadow border-gray-600 max-w-xl m-auto">
            <Form
              onSubmit={onSubmit}
              render={({ handleSubmit, submitting, pristine }) => (
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex-col flex items-center"
                  noValidate
                >
                  <div className="m-3 w-3/4">
                    <Field
                      name="iban"
                      component={TextField}
                      type="text"
                      label="IBAN"
                      size="medium"
                      required
                      fullWidth
                    />
                    {errors?.iban && (
                      <span className="text-red-600 font-bold underline text-sm">
                        {errors.iban}
                      </span>
                    )}
                  </div>

                  <div className="m-3 w-3/4">
                    <Field
                      name="bic"
                      component={TextField}
                      type="text"
                      label="BIC"
                      size="medium"
                      required
                      fullWidth
                    />

                    {errors?.bic && (
                      <span className="text-red-600 font-bold underline text-sm">
                        {errors.bic}
                      </span>
                    )}
                  </div>

                  <div className="m-3 w-3/4">
                    <Field
                      name="holder"
                      component={TextField}
                      type="text"
                      label="Holder fullname"
                      size="medium"
                      required
                      fullWidth
                    />

                    {errors?.holder && (
                      <span className="text-red-600 font-bold underline text-sm">
                        {errors.holder}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 mb-5 justify-center flex space-x-5">
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      disabled={submitting || pristine}
                      className="hover:scale-110 transform"
                    >
                      Confirm
                    </Button>

                    <Button
                      onClick={handleClose}
                      color="secondary"
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            />
          </div>

          <DialogContentText className="text-center">
            Don't use your real bank account
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Success adding your bank account
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddBankAccount;
