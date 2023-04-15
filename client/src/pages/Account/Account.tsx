import React, { useState, useContext, useEffect, lazy, Suspense } from 'react';
import { Form, Field } from 'react-final-form';
import { Button, Snackbar, SnackbarCloseReason } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { TextField } from 'final-form-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  Lock,
  LockOpen,
  Home,
  Search,
  Payment,
  Store,
} from '@material-ui/icons';
import axios from 'axios';
import { Link, Routes, Route } from 'react-router-dom';

import { UserContext } from '../../context/UserContext';
import AccountNavBar from '../../components/AccountNavBar';
import FallBack from '../../components/FallBack';

const Addresses = lazy(() => import('./Addresses/Addresses'));
const Payments = lazy(() => import('./Payments/Payments'));
const Stock = lazy(() => import('./Stock'));
const Orders = lazy(() => import('./Orders'));

type Values = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

type Error = Partial<Values>;

type CardProps = {
  title: string;
  description: string;
  link: string;
  icon: React.ReactElement;
};

type UpdatePasswordProps = {
  token: string | null;
  setIsUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChangedPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

const AccountPage = () => {
  useEffect(() => {
    document.title = 'Your Account';
  });

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [changedPassword, setChangedPassword] = useState(false);
  const { token } = useContext(UserContext);

  const handleClose = (
    event?: React.SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'timeout') {
      setChangedPassword(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="w-2/3 mb-10 m-auto">
        <p className="text-4xl relative text-center">Your Account</p>
      </div>

      <div className="mt-5 w-2/3 flex m-auto space-x-5 justify-center items-center">
        <div className="space-x-1">
          <Card
            title="Your Orders"
            description="View your in progress and delivered orders "
            link="/account/orders"
            icon={<Search color="primary" style={{ fontSize: 60 }} />}
          />

          <Card
            title="Your Payments"
            description="Configure your payment methods and parameters, show your balance "
            link="/account/payments/wallet"
            icon={<Payment color="primary" style={{ fontSize: 60 }} />}
          />
        </div>

        <div className="space-x-1">
          <Card
            title="Your Addresses"
            description="Change your addresses of delivery"
            link="/account/addresses"
            icon={<Home color="primary" style={{ fontSize: 60 }} />}
          />
          <Card
            title="Your Stock"
            description="View your currently on sale and solds items"
            link="/account/stock"
            icon={<Store color="primary" style={{ fontSize: 60 }} />}
          />
        </div>
      </div>

      <div className="text-center mt-10">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsUpdateOpen(!isUpdateOpen)}
          disabled={isUpdateOpen}
        >
          Change password
        </Button>
      </div>

      {isUpdateOpen && (
        <UpdatePasswordForm
          token={token}
          setIsUpdateOpen={setIsUpdateOpen}
          setChangedPassword={setChangedPassword}
        />
      )}

      <Snackbar
        open={changedPassword}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Success updating password
        </Alert>
      </Snackbar>
    </div>
  );
};

const UpdatePasswordForm = ({
  token,
  setIsUpdateOpen,
  setChangedPassword,
}: UpdatePasswordProps) => {
  const [errors, setErrors] = useState<Error>({});

  const onSubmit = async (values: Values) => {
    const { oldPassword, password, confirmPassword } = values;
    const finalErrors: Error = {};

    if (!oldPassword) {
      finalErrors.oldPassword = 'Empty';
    } else if (oldPassword.length < 7) {
      finalErrors.oldPassword = 'Atleast 7 characters';
    }

    if (!password) {
      finalErrors.password = 'Empty';
    } else if (password.length < 7) {
      finalErrors.password = 'Atleast 7 characters';
    } else if (confirmPassword !== password) {
      finalErrors.confirmPassword = 'Password not matching';
    } else if (password === oldPassword) {
      finalErrors.password = "New password shouldn't be equal to old password";
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      try {
        await axios.put(
          '/api/user/updatePassword',
          { password, oldPassword },
          {
            headers: {
              authorization: token,
            },
          }
        );

        setIsUpdateOpen(false);
        setChangedPassword(true);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data.error === 'Wrong Password') {
            setErrors({ oldPassword: 'Wrong Password' });
          }
        }
      }
    }
  };

  return (
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
              <div
                className={errors?.oldPassword && 'border-2 p-2 border-red-700'}
              >
                <Field
                  name="oldPassword"
                  component={TextField}
                  type="password"
                  placeholder="Old Password"
                  label="Old Password"
                  size="medium"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOpen />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {errors?.oldPassword && (
                <span className="text-red-600 font-bold underline text-sm">
                  {errors.oldPassword}
                </span>
              )}
            </div>

            <div className="m-3 w-3/4">
              <div
                className={errors?.password && 'border-2 p-2 border-red-700'}
              >
                <Field
                  name="password"
                  component={TextField}
                  type="password"
                  placeholder="New Password"
                  label="New Password"
                  size="medium"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {errors?.password && (
                <span className="text-red-600 font-bold underline text-sm">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="m-3 w-3/4">
              <div
                className={
                  errors?.confirmPassword && 'border-2 p-2 border-red-700'
                }
              >
                <Field
                  name="confirmPassword"
                  component={TextField}
                  type="password"
                  placeholder="Confirm Password"
                  label="Confirm Password"
                  size="medium"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {errors?.confirmPassword && (
                <span className="text-red-600 font-bold underline text-sm">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="mt-5 mb-5 justify-center flex space-x-5">
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={submitting || pristine}
                className="hover:scale-110 transform m-5"
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsUpdateOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

const Card = ({ title, description, link, icon }: CardProps) => (
  <Link to={link}>
    <div className="border-2 rounded-xl border-gray-300 m-auto w-80 h-28 hover:bg-gray-200 flex">
      {icon}
      <div className="ml-3">
        <p className="font-bold text-xl">{title}</p>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
    </div>
  </Link>
);
const Account = () => {
  const path = window.location.pathname;
  return (
    <>
      <AccountNavBar />
      <Suspense fallback={<FallBack />}>
        <Routes>
          <Route path={path} element={<AccountPage />} />

          <Route path={`${path}/addresses`} element={<Addresses />} />

          <Route path={`${path}/payments`} element={<Payments />} />

          <Route path={`${path}/stock`} element={<Stock />} />

          <Route path={`${path}/orders`} element={<Orders />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Account;
