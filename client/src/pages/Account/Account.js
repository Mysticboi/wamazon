import React, { useState, useContext, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from '@material-ui/core';
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
import { UserContext } from '../../context/UserContext';
import { Link, useRouteMatch, Switch, Route } from 'react-router-dom';
import Addresses from './Addresses/Addresses';

const AccountPage = () => {
  useEffect(() => (document.title = 'My Account'));

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [changedPassword, setChangedPassword] = useState(false);
  const { token } = useContext(UserContext);
  return (
    <div className="mt-5">
      <p className="text-4xl text-center mb-10">My Account</p>

      <div className="mt-5 w-2/3 flex m-auto space-x-5 justify-center items-center">
        <div className="space-x-1">
          <Card
            title="Your Orders"
            description="View your in progress and delivered orders "
            link="/home"
            icon={<Search color="primary" style={{ fontSize: 60 }} />}
          />

          <Card
            title="Your Payments"
            description="Configure your payment methods and parameters, show your balance "
            link="/home"
            icon={<Payment color="primary" style={{ fontSize: 60 }} />}
          />
        </div>

        <div className="space-x-1">
          <Card
            title="Addresses"
            description="Change your addresses of delivery"
            link="/account/addresses"
            icon={<Home color="primary" style={{ fontSize: 60 }} />}
          />
          <Card
            title="Your Stock"
            description="View your currently on sale and solds items"
            link="/home"
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

      {changedPassword && (
        <p className="text-green-500 text-center mt-5">
          Succesfly updated password
        </p>
      )}
    </div>
  );
};

const UpdatePasswordForm = ({ token, setIsUpdateOpen, setChangedPassword }) => {
  const [errors, setErrors] = useState({});

  const onSubmit = async (values) => {
    const { oldPassword, password, confirmPassword } = values;
    let finalErrors = {};
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
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      try {
        await axios.post(
          'http://localhost:5000/user/updatePassword',
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
        if (error.response?.data.error === 'Wrong Password') {
          setErrors({ oldPassword: 'Wrong Password' });
        }
      }
    }
  };

  return (
    <div className="flex justify-center mt-10 border-2 shadow border-gray-600 max-w-xl m-auto">
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, pristine, values }) => (
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
      ></Form>
    </div>
  );
};

const Card = ({ title, description, link, icon }) => {
  return (
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
};

const Account = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <AccountPage />
      </Route>

      <Route path={`${path}/addresses`}>
        <Addresses />
      </Route>
    </Switch>
  );
};

export default Account;
