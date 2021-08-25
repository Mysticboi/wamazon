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
import Cards from 'react-credit-cards';
import Payment from 'payment';
import { UserContext } from '../../../../context/UserContext';

import visa from '../../../../images/visa.png';
import 'react-credit-cards/es/styles-compiled.css';
import { CreditCardT } from './Wallet';

type AddCreditCardProps = {
  setCreditCards: React.Dispatch<React.SetStateAction<CreditCardT[]>>;
};

type Values = {
  number: string;
  expiry: string;
  name: string;
  cvc: string;
};

type Error = Partial<Values>;

const AddCreditCard = ({ setCreditCards }: AddCreditCardProps) => {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Error>({});
  const [success, setSuccess] = useState(false);
  const { token } = useContext(UserContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const onSubmit = async (values: Values) => {
    const { number, expiry, name, cvc } = values;

    const finalErrors: Error = {};

    if (!number || number.length !== 19) {
      finalErrors.number = '16 Numbers';
    }
    if (!cvc || cvc.length !== 3) {
      finalErrors.cvc = '3 Numbers';
    }
    if (!name || name.split(' ').length < 2) {
      finalErrors.name = '2 words';
    }

    if (!isExpireValid(expiry)) {
      finalErrors.expiry = 'Invalid expire date';
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      const data = { number, expiry, name, cvc };
      try {
        const response = await axios.post(
          'http://localhost:5000/creditCard',
          data,
          {
            headers: {
              authorization: token,
            },
          }
        );
        const { creditCardId } = response.data;

        const maskedNumber = `***-${number.slice(
          number.length - 4,
          number.length
        )}`;

        const newCreditCard = {
          _id: creditCardId,
          number: maskedNumber,
          expiry,
          name,
        };

        setCreditCards((prev) => [...prev, newCreditCard]);

        setOpen(false);
        setSuccess(true);
      } catch (error) {
        console.error('Failed creating credit card', error);
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
      <p className="text-2xl mt-2">Add a credit card</p>
      <div className="w-3/4">
        <p className="w-3/4 text-md">
          You will need your card informations, we only accept VISA cards
        </p>
      </div>
      <div className="w-3/4 relative">
        <img
          src={visa}
          alt="visa"
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
        Add a credit card
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title" className="text-center">
          Add a credit card
        </DialogTitle>
        <DialogContent>
          <div className="flex justify-center border-2 shadow border-gray-600 max-w-xl m-auto">
            <Form
              onSubmit={onSubmit}
              render={({
                handleSubmit,
                submitting,
                pristine,
                values,
                active,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  className="w-full flex-col flex items-center"
                  noValidate
                >
                  <div className="h-2" />
                  <Cards
                    number={values.number || ''}
                    name={values.name || ''}
                    expiry={values.expiry || ''}
                    cvc={values.cvc || ''}
                    focused={active}
                  />
                  <div className="m-3 w-3/4">
                    <Field
                      name="number"
                      component={TextField}
                      type="text"
                      label="Card number"
                      size="medium"
                      pattern="[\d| ]{16,22}"
                      required
                      fullWidth
                      initialValue="4"
                      format={formatCreditCardNumber}
                    />
                    {errors?.number && (
                      <span className="text-red-600 font-bold underline text-sm">
                        {errors.number}
                      </span>
                    )}
                  </div>

                  <div className="m-3 w-3/4">
                    <Field
                      name="name"
                      component={TextField}
                      type="text"
                      label="Holder fullname"
                      size="medium"
                      required
                      fullWidth
                    />

                    {errors?.name && (
                      <span className="text-red-600 font-bold underline text-sm">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="m-3 w-3/4 flex space-x-16">
                    <div className="w-32">
                      <Field
                        name="expiry"
                        component={TextField}
                        type="text"
                        label="Expire date"
                        size="medium"
                        required
                        fullWidth
                        pattern="\d\d/\d\d"
                        format={formatExpirationDate}
                      />

                      {errors?.expiry && (
                        <span className="text-red-600 font-bold underline text-sm">
                          {errors.expiry}
                        </span>
                      )}
                    </div>

                    <div className="w-20">
                      <Field
                        name="cvc"
                        component={TextField}
                        type="text"
                        label="CVC"
                        size="medium"
                        required
                        fullWidth
                        pattern="\d{3,4}"
                        format={formatCVC}
                        maxlength="3"
                      />

                      {errors?.cvc && (
                        <span className="text-red-600 font-bold underline text-sm">
                          {errors.cvc}
                        </span>
                      )}
                    </div>
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
            Don't use your real credit card
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Success adding credit card
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddCreditCard;

function clearNumber(value = '') {
  return value.replace(/\D+/g, '');
}

function formatCreditCardNumber(value: string) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;

  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 15)}`;
      break;
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
      break;
  }

  return nextValue.trim();
}

function formatCVC(value: string, prevValue: string, allValues: Error = {}) {
  const clearValue = clearNumber(value);
  let maxLength = 4;

  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === 'amex' ? 4 : 3;
  }

  return clearValue.slice(0, maxLength);
}
function formatExpirationDate(value: string) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}

const isExpireValid = (expiry: string): boolean => {
  if (!expiry) return false;
  if (expiry.length !== 5) return false;
  const month = +expiry.split('/')[0];

  if (month > 12 || month < 1) return false;

  return true;
};
