import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { Form, Field } from 'react-final-form';
import { Button } from '@material-ui/core';
import { TextField } from 'final-form-material-ui';
import { useHistory } from 'react-router-dom';

const UpdateAddress = () => {
  const { addressId } = useParams();
  const { token } = useContext(UserContext);
  const [address, setAddress] = useState({});
  const [errors, setErrors] = useState({});
  const history = useHistory();

  useEffect(() => {
    const getAddress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/address/${addressId}`,
          {
            headers: {
              authorization: token,
            },
          }
        );

        const adr = response.data.address;
        console.log('address', adr);
        setAddress(adr);
      } catch (error) {
        console.error('Failed getting address', error);
      }
    };

    getAddress();
  }, [addressId, token]);

  const onSubmit = async (values) => {
    const { address, city, region, zipCode, phoneNumber } = values;
    console.log(values);

    let finalErrors = {};

    const keys = [
      'country',
      'address',
      'city',
      'region',
      'zipCode',
      'phoneNumber',
    ];
    keys.forEach((key) => {
      if (!values[key]) {
        finalErrors[key] = 'Empty';
      }
    });
    if (zipCode && isNaN(zipCode)) {
      finalErrors.zipCode = 'Must be a number';
    }

    if (phoneNumber && isNaN(phoneNumber)) {
      finalErrors.phoneNumber = 'Must be a number';
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      const data = { address, city, region, zipCode, phoneNumber };
      try {
        await axios.put(
          `http://localhost:5000/user/address/${addressId}`,
          data,
          {
            headers: {
              authorization: token,
            },
          }
        );

        history.push('/account/addresses');
      } catch (error) {
        console.error('Failed creating address', error);
      }
    }
  };

  return (
    <div className="mt-5">
      <p className="text-4xl text-center mb-10">Editing Address</p>

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
                <Field
                  name="country"
                  component={TextField}
                  type="text"
                  placeholder="Country"
                  label="Country"
                  size="medium"
                  fullWidth
                  disabled
                  initialValue={address.country}
                />

                {errors?.country && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.country}
                  </span>
                )}
              </div>

              <div className="m-3 w-3/4">
                <Field
                  name="address"
                  component={TextField}
                  type="text"
                  placeholder="Address"
                  label="Address"
                  size="medium"
                  required
                  fullWidth
                  initialValue={address.address}
                />
                {errors?.address && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.address}
                  </span>
                )}
              </div>

              <div className="m-3 w-3/4">
                <Field
                  name="city"
                  component={TextField}
                  type="text"
                  placeholder="City"
                  label="City"
                  size="medium"
                  required
                  fullWidth
                  initialValue={address.city}
                />

                {errors?.city && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.city}
                  </span>
                )}
              </div>

              <div className="m-3 w-3/4">
                <Field
                  name="region"
                  component={TextField}
                  type="text"
                  placeholder="Region"
                  label="Region"
                  size="medium"
                  required
                  fullWidth
                  initialValue={address.region}
                />

                {errors?.region && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.region}
                  </span>
                )}
              </div>

              <div className="m-3 w-3/4">
                <Field
                  name="zipCode"
                  component={TextField}
                  type="text"
                  placeholder="Zip Code"
                  label="Zip Code"
                  size="medium"
                  required
                  fullWidth
                  initialValue={address.zipCode}
                />

                {errors?.zipCode && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.zipCode}
                  </span>
                )}
              </div>

              <div className="m-3 w-3/4">
                <Field
                  name="phoneNumber"
                  component={TextField}
                  type="text"
                  placeholder="Phone Number"
                  label="Phone Number"
                  size="medium"
                  required
                  fullWidth
                  initialValue={address.phoneNumber}
                />

                {errors?.phoneNumber && (
                  <span className="text-red-600 font-bold underline text-sm">
                    {errors.phoneNumber}
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
                  variant="contained"
                  color="secondary"
                  onClick={() => history.push('/account/addresses')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        ></Form>
      </div>
    </div>
  );
};

export default UpdateAddress;