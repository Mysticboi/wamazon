import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { InputAdornment, Button, IconButton } from '@material-ui/core';
import TextFieldCore from '@material-ui/core/TextField';
import { Euro, Clear } from '@material-ui/icons';
import Select from 'react-select';
import categories from '../data/categories.json';
import ImagesField from '../components/ImagesField';

type Values = {
  productName: string;
  price: number;
  description: string;
  quantity: number;
  category: { value: string; label: string };
  images: FileList;
};

type Error = {
  productName?: string;
  price?: string;
  description?: string;
  quantity?: string;
  category?: string;
  informations?: string;
};

type Information = {
  name: string;
  value: string;
};

const Marketplace = () => {
  const [errors, setErrors] = useState<Error>({});
  const [informations, setInformations] = useState<Information[]>([]);

  const options = categories.map((category) => ({
    value: category,
    label: category,
  }));
  useEffect(() => {
    document.title = 'Marketplace';
  });

  const onSubmit = async (values: Values) => {
    const { productName, price, description, quantity, images } = values;

    const category = values?.category?.value;

    const finalErrors: Error = {};

    if (!productName) {
      finalErrors.productName = 'Empty';
    }
    if (!category) {
      finalErrors.category = 'Empty';
    }
    if (!price) {
      finalErrors.price = 'Empty';
    } else if (isNaN(price)) {
      finalErrors.price = 'Must be a number';
    }
    if (!description) {
      finalErrors.description = 'Empty';
    }
    if (!quantity) {
      finalErrors.quantity = 'Empty';
    } else if (isNaN(quantity)) {
      finalErrors.quantity = 'Must be a number';
    }

    if (!validateInformations(informations)) {
      finalErrors.informations = 'Complete or delete unnecessary fields';
    }

    setErrors(finalErrors);
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    i: number
  ) => {
    const val = e.target.value;
    setInformations((prev) =>
      prev.map((information, index) =>
        index === i ? { ...information, name: val } : { ...information }
      )
    );
  };
  const handleValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    i: number
  ) => {
    const val = e.target.value;
    setInformations((prev) =>
      prev.map((information, index) =>
        index === i ? { ...information, value: val } : { ...information }
      )
    );
  };
  return (
    <div>
      <div className="text-center text-2xl bg-gray-100 h-20 flex justify-center items-center">
        <p>Welcome to the Marketplace</p>
      </div>

      <div className="mt-3">
        <p className="text-center text-xl">Sell an item</p>

        <div className="flex justify-center mt-10 border-2 shadow border-gray-600 max-w-4xl m-auto">
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} className="w-full ml-7" noValidate>
                <div className="flex">
                  <div>
                    <div className="m-3 w-3/4">
                      <div>
                        <Field
                          error
                          name="productName"
                          component={TextField}
                          type="text"
                          label="Product name"
                          size="medium"
                          required
                          fullWidth
                        />
                      </div>

                      {errors?.productName && (
                        <span className="text-red-600 font-bold underline text-sm">
                          {errors.productName}
                        </span>
                      )}
                    </div>

                    <div className="m-3 w-3/4">
                      <div>
                        <Field
                          name="price"
                          component={TextField}
                          type="text"
                          placeholder="Price"
                          label="Price"
                          size="medium"
                          required
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Euro />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>

                      {errors?.price && (
                        <span className="text-red-600 font-bold underline text-sm">
                          {errors.price}
                        </span>
                      )}
                    </div>

                    <div className="m-3 w-3/4">
                      <div>
                        <Field
                          name="description"
                          component="textarea"
                          placeholder="Description..."
                          className="w-96 border-2 shadow border-gray-500 h-20"
                        />
                      </div>

                      {errors?.description && (
                        <span className="text-red-600 font-bold underline text-sm">
                          {errors.description}
                        </span>
                      )}
                    </div>

                    <div className="m-3 w-3/4">
                      <div>
                        <Field
                          name="quantity"
                          component={TextField}
                          type="text"
                          label="Quantity"
                          size="medium"
                          required
                          fullWidth
                        />
                      </div>

                      {errors?.quantity && (
                        <span className="text-red-600 font-bold underline text-sm">
                          {errors.quantity}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="m-3 w-3/4 mt-6">
                      <Field name="category">
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
                              aria-label="Category"
                              placeholder="Category"
                              label="Category"
                            />
                          </div>
                        )}
                      </Field>

                      {errors?.category && (
                        <span className="text-red-600 font-bold underline text-sm">
                          {errors.category}
                        </span>
                      )}
                    </div>

                    <div className="m-3 w-3/4">
                      <p className="text-gray-600 mb-2 mt-5">
                        Add multiple images
                      </p>
                      <ImagesField name="images" />
                    </div>

                    <div className="m-3 w-3/4">
                      <p className="text-gray-600 mb-2 mt-5">
                        Add Additional Informations
                      </p>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                        onClick={() =>
                          setInformations([
                            ...informations,
                            { name: '', value: '' },
                          ])
                        }
                      >
                        Add information
                      </button>

                      {informations.map(({ name, value }, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div className="flex space-x-5 mt-5" key={i}>
                          <TextFieldCore
                            label="Name"
                            value={name}
                            onChange={(e) => handleNameChange(e, i)}
                          />
                          <TextFieldCore
                            label="Information"
                            value={value}
                            onChange={(e) => handleValueChange(e, i)}
                          />
                          <IconButton
                            onClick={() => {
                              setInformations((prev) =>
                                prev.filter((item, index) => index !== i)
                              );
                            }}
                          >
                            <Clear color="secondary" />
                          </IconButton>
                        </div>
                      ))}

                      {errors?.informations && informations.length !== 0 && (
                        <span className="text-red-600 font-bold underline text-sm">
                          {errors.informations}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 mb-5 justify-center flex space-x-5">
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    className="hover:scale-110 transform"
                  >
                    Confirm
                  </Button>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </div>
  );
};

const validateInformations = (informations: Information[]): boolean => {
  if (informations.length === 0) return true;

  for (let i = 0; i < informations.length; i += 1) {
    const { name, value } = informations[i];
    if (!name || !value) return false;
  }

  return true;
};

export default Marketplace;
