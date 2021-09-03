import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { Button } from '@material-ui/core';
import { TextField } from 'final-form-material-ui';
import Select from 'react-select';
import axios from 'axios';
import countries from '../../../data/countries.json';
import { UserContext } from '../../../context/UserContext';

type Values = {
  country: { value: string };
  address: string;
  city: string;
  region: string;
  zipCode: number;
  phoneNumber: number;
  key?: string;
};

type Error = {
  country?: string;
  address?: string;
  city?: string;
  region?: string;
  zipCode?: string;
  phoneNumber?: string;
};

const AddAddress = () => {
  const [errors, setErrors] = useState<Error>({});
  const history = useHistory();
  const { token } = useContext(UserContext);

  const options = countries.map(({ name }) => ({ value: name, label: name }));

  const onSubmit = async (values: Values) => {
    const {
      country: { value: country } = {},
      address,
      city,
      region,
      zipCode,
      phoneNumber,
    } = values;

    const finalErrors: Error = {};

    if (!country) {
      finalErrors.country = 'Empty';
    }
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
    } else if (isNaN(zipCode)) {
      finalErrors.zipCode = 'Must be a number';
    }
    if (!phoneNumber) {
      finalErrors.phoneNumber = 'Empty';
    } else if (isNaN(phoneNumber)) {
      finalErrors.phoneNumber = 'Must be a number';
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      const data = { country, address, city, region, zipCode, phoneNumber };
      try {
        await axios.post('http://localhost:5000/user/address', data, {
          headers: {
            authorization: token,
          },
        });

        history.push('/account/addresses');
      } catch (error) {
        console.error('Failed creating address', error);
      }
    }
  };
  return (
    <div className="mt-5">
      <p className="text-4xl text-center mb-10">Add a new address</p>

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
                <Field name="country">
                  {(props) => (
                    <div>
                      <Select
                        // eslint-disable-next-line react/prop-types
                        name={props.input.name}
                        // eslint-disable-next-line react/prop-types
                        value={props.input.value}
                        // eslint-disable-next-line react/prop-types
                        onChange={props.input.onChange}
                        options={options}
                        aria-label="Country"
                        placeholder="Country"
                        label="Country"
                      />
                    </div>
                  )}
                </Field>

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
                  label="Address"
                  size="medium"
                  required
                  fullWidth
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

export default AddAddress;
