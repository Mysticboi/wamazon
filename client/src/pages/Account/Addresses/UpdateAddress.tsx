import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { Button } from '@material-ui/core';
import { TextField } from 'final-form-material-ui';
import { UserContext } from '../../../context/UserContext';
import { Address } from './Addresses';

type Values = {
  address: string;
  city: string;
  region: string;
  zipCode: number;
  phoneNumber: number;
};

type Error = {
  address?: string;
  city?: string;
  region?: string;
  zipCode?: string;
  phoneNumber?: string;
};

const UpdateAddress = () => {
  const { addressId } = useParams<{ addressId: string }>();
  const { token } = useContext(UserContext);
  const [address, setAddress] = useState<Partial<Address>>({});
  const [errors, setErrors] = useState<Error>({});
  const history = useHistory();

  useEffect(() => {
    const getAddress = async () => {
      try {
        const response = await axios.get(`/api/user/address/${addressId}`, {
          headers: {
            authorization: token,
          },
        });

        const adr: Address = response.data.address;
        setAddress(adr);
      } catch (error) {
        console.error('Failed getting address', error);
      }
    };

    getAddress();
  }, [addressId, token]);

  const onSubmit = async (values: Values) => {
    const { address, city, region, zipCode, phoneNumber } = values;

    const finalErrors: Error = {};

    if (!address) {
      finalErrors.address = 'Empty';
    }
    if (!city) {
      finalErrors.city = 'Empty';
    }
    if (!region) {
      finalErrors.region = 'Empty';
    }
    if (!zipCode) {
      finalErrors.zipCode = 'Empty';
    }
    if (!phoneNumber) {
      finalErrors.phoneNumber = 'Empty';
    }

    if (zipCode && Number.isNaN(zipCode)) {
      finalErrors.zipCode = 'Must be a number';
    }

    if (phoneNumber && Number.isNaN(phoneNumber)) {
      finalErrors.phoneNumber = 'Must be a number';
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      const data = { address, city, region, zipCode, phoneNumber };
      try {
        await axios.put(`/api/user/address/${addressId}`, data, {
          headers: {
            authorization: token,
          },
        });

        history.push('/account/addresses');
      } catch (error) {
        console.error('Failed updating address', error);
      }
    }
  };

  return (
    <div className="mt-5">
      <p className="text-4xl text-center mb-10">Update Address</p>

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
                  name="country"
                  component={TextField}
                  type="text"
                  label="Country"
                  size="medium"
                  fullWidth
                  disabled
                  initialValue={address.country}
                />
              </div>

              <div className="m-3 w-3/4">
                <Field
                  name="address"
                  component={TextField}
                  type="text"
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
        />
      </div>
    </div>
  );
};

export default UpdateAddress;
