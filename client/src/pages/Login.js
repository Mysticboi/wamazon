import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from '@material-ui/core';
import { TextField } from 'final-form-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Mail, Lock } from '@material-ui/icons';
// import axios from 'axios';
// import { useHistory } from 'react-router-dom';

const Login = () => {
  const [errors, setErrors] = useState({});
  //   const history = useHistory();

  const onSubmit = async (values) => {
    const { email, password } = values;
    let finalErrors = {};

    if (!validateEmail(email)) {
      finalErrors.email = 'Invalid email';
    }

    if (password.length < 7) {
      finalErrors.password = 'Atleast 7 characters';
    }

    setErrors(finalErrors);
  };

  return (
    <div>
      <p className="text-center text-5xl mt-10">Login</p>
      <p className="text-center text-3xl mt-5">
        And start buying whatever you need
      </p>
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
                <div className={errors?.email && 'border-2 p-2 border-red-700'}>
                  <Field
                    error
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
                </div>

                {errors?.email && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.email}
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
                </div>

                {errors?.password && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.password}
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
                  Login
                </Button>
              </div>
            </form>
          )}
        ></Form>
      </div>
    </div>
  );
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export default Login;
