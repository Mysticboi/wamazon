import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from '@material-ui/core';
import { TextField } from 'final-form-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';
import { AccountCircle, Mail, Lock, LockOpen } from '@material-ui/icons';
import axios from 'axios';
import _ from 'lodash';
import { useHistory, Link } from 'react-router-dom';

type Values = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Error = Partial<Values>;

const Signup = () => {
  const [errors, setErrors] = useState<Error>({});
  const history = useHistory();

  useEffect(() => {
    document.title = 'Sign up';
  }, []);

  const onSubmit = async (values: Values) => {
    const { fullName, email, password, confirmPassword } = values;
    const finalErrors: Error = {};

    if (!fullName || fullName.split(' ').length < 2) {
      finalErrors.fullName = 'At least 2 words';
    }

    if (!validateEmail(email)) {
      finalErrors.email = 'Invalid email';
    }

    if (!password || password.length < 7) {
      finalErrors.password = 'Atleast 7 characters';
    } else if (password !== confirmPassword) {
      finalErrors.confirmPassword = 'Password not matching';
    }
    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      const data = _.omit(values, ['confirmPassword']);
      try {
        await axios.post('http://localhost:5000/user/signup', data);
        history.push('/login');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data.error === 'Not unique email') {
            setErrors({ email: 'Email already in use' });
          }
        }
      }
    }
  };
  return (
    <div>
      <p className="text-center text-5xl mt-10">Sign Up</p>
      <p className="text-center text-3xl mt-5">It's fast and easy</p>
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
                  name="fullName"
                  component={TextField}
                  type="text"
                  label="Full Name"
                  size="medium"
                  placeholder="Full Name"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />

                {errors?.fullName && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="m-3 w-3/4">
                <Field
                  name="email"
                  component={TextField}
                  type="email"
                  label="Email"
                  size="medium"
                  placeholder="Email"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail />
                      </InputAdornment>
                    ),
                  }}
                />
                {errors?.email && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="m-3 w-3/4">
                <Field
                  name="password"
                  component={TextField}
                  type="password"
                  label="Password"
                  placeholder="Password"
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

                {errors?.password && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="m-3 w-3/4">
                <Field
                  name="confirmPassword"
                  component={TextField}
                  type="password"
                  label="Confirm Password"
                  size="medium"
                  placeholder="Confirm Password"
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

                {errors?.confirmPassword && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="mt-5 mb-5 justify-center flex">
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={submitting || pristine}
                  className="hover:scale-110 transform"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          )}
        />
      </div>
      <p className="text-center text-xl mt-5">
        Already got an account?{' '}
        <Link
          to="/login"
          className="underline text-indigo-600 hover:text-indigo-900 transform"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

const validateEmail = (email: string) => {
  if (!email) return false;
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

export default Signup;
