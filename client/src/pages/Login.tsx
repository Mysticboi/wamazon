import React, { useState, useContext, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  SnackbarCloseReason,
} from '@material-ui/core';

import TextFieldCore from '@material-ui/core/TextField';
import { Alert } from '@material-ui/lab';
import { TextField } from 'final-form-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Mail, Lock } from '@material-ui/icons';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

type Values = {
  email: string;
  password: string;
};

type Error = Partial<Values>;

const Login = () => {
  const [errors, setErrors] = useState<Error>({});
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successForgot, setSuccessForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userContext = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    document.title = 'Login to Wamazon';
  }, []);

  const onSubmit = async (values: Values) => {
    const { email, password } = values;
    const finalErrors: Error = {};

    if (!validateEmail(email)) {
      finalErrors.email = 'Invalid email';
    }
    if (!password) {
      finalErrors.password = 'Empty';
    } else if (password?.length < 7) {
      finalErrors.password = 'Atleast 7 characters';
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      try {
        const response = await axios.post(
          'http://localhost:5000/user/login',
          values
        );
        const { fullName, token } = response.data;

        userContext.setToken(token);
        userContext.setUserName(fullName.split(' ')[0]);

        history.push('/');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data.error;
          switch (errorMessage) {
            case 'Email not found':
              setErrors({ email: 'Email not found' });
              break;
            case 'Wrong Password':
              setErrors({ password: 'Wrong Password' });
              break;

            default:
              break;
          }
        }
      }
    }
  };

  const handleClickOpen = (loginEmail: string) => {
    if (loginEmail) {
      setEmail(loginEmail);
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setEmail('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleConfirm = async () => {
    if (!validateEmail(email)) {
      setError('Invalid email');
    } else {
      try {
        setError('');
        setIsLoading(true);
        await axios.put('http://localhost:5000/user/forgotPassword', { email });
        setIsLoading(false);
        setOpen(false);
        setSuccessForgot(true);
        setEmail('');
      } catch (e) {
        setIsLoading(false);
        if (axios.isAxiosError(e)) {
          const status = e.response?.status;
          if (status === 404) {
            setError('Email not found');
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
      setSuccessForgot(false);
    }
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

              <div className="mt-5 mb-5 justify-center flex space-x-5">
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={submitting || pristine}
                  className="hover:scale-110 transform"
                >
                  Login
                </Button>

                <Button
                  variant="contained"
                  type="button"
                  color="secondary"
                  size="small"
                  onClick={() => handleClickOpen(values?.email)}
                >
                  I forgot my password
                </Button>
              </div>
            </form>
          )}
        />
      </div>
      <p className="text-center text-xl mt-5">
        Don't have an account yet?{' '}
        <Link
          to="/signup"
          className="underline text-indigo-600 hover:text-indigo-900 transform"
        >
          Sign Up
        </Link>
      </p>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" className="text-center">
          Forgotten password
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your email to receive a mail with a new password.
          </DialogContentText>
          <div className="w-64 text-center m-auto">
            <TextFieldCore
              autoFocus
              margin="dense"
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={handleChange}
              error={!!error}
              color="primary"
              fullWidth
            />
          </div>

          {isLoading && (
            <div className="flex justify-center items-center mt-5">
              <CircularProgress />
            </div>
          )}

          <div className="text-red-600 underline m-2 text-center h-5 font-bold">
            {error}
          </div>

          {error === 'Email not found' && (
            <p className="text-center mt-2 mb-5">
              Don't have an account yet?{' '}
              <Link
                to="/signup"
                className="underline text-indigo-600 hover:text-indigo-900 transform"
              >
                Sign Up
              </Link>
            </p>
          )}
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
        open={successForgot}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Success: Check your email
        </Alert>
      </Snackbar>
    </div>
  );
};

const validateEmail = (email: string) => {
  if (!email) return false;
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
};

export default Login;
