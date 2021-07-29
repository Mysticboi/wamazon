import React, { useState, useContext, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from '@material-ui/core';
import { TextField } from 'final-form-material-ui';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Lock, LockOpen } from '@material-ui/icons';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Account = () => {
  useEffect(() => (document.title = 'My Account'));
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [changedPassword, setChangedPassword] = useState(false);
  const { token } = useContext(UserContext);
  return (
    <div className="mt-5">
      <p className="text-4xl text-center">My Account</p>
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
                  {errors.oldPassword}
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

export default Account;
