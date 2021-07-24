import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from '@material-ui/core';
import { TextField } from 'final-form-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';
import { AccountCircle, Mail, Lock, LockOpen } from '@material-ui/icons';

const Signup = () => {
  const [errors, setErrors] = useState({});
  const onSubmit = (values) => {
    const { fullName, password, confirmPassword } = values;
    let finalErrors = {};

    if (fullName.split(' ').length < 2) {
      finalErrors.fullName = 'At least 2 words';
    }

    if (password.length < 7) {
      finalErrors.password = 'Atleast 7 characters';
    } else if (password !== confirmPassword) {
      finalErrors.confirmPassword = 'Password not matching';
    }
    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      console.log(values);
    }
  };
  return (
    <div>
      <p className="text-center text-5xl mt-10">Sign Up</p>
      <p className="text-center text-3xl mt-5">It's fast and easy</p>
      <div className="flex justify-center mt-10 border-2 shadow border-gray-600 max-w-xl m-auto">
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, pristine, values }) => (
            <form
              onSubmit={handleSubmit}
              className="w-full flex-col flex items-center"
            >
              <div className="m-3 w-3/4">
                <Field
                  name="fullName"
                  component={TextField}
                  type="text"
                  placeholder="Full Name"
                  label="Full Name"
                  size="medium"
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
                  placeholder="Email"
                  label="Email"
                  size="medium"
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
                  placeholder="Password"
                  label="Password"
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
                  placeholder="Confirm Password"
                  label="Confirm Password"
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
                >
                  Sign Up
                </Button>
              </div>
            </form>
          )}
        ></Form>
      </div>
    </div>
  );
};

export default Signup;
