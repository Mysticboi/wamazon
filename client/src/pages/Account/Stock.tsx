import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CircularProgress,
  Dialog,
  DialogTitle,
  Button,
  Switch,
} from '@material-ui/core';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

interface Product {
  _id: string;
  productName: string;
  price: number;
  quantity: number;
  nSold: number;
  imgUrl: string;
  isInShop: boolean;
}
interface CardProps extends Product {
  token: string | null;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setToUpdateProduct: React.Dispatch<React.SetStateAction<string>>;
  isAdmin: boolean;
}

type Values = {
  productName: string;
  price: number;
  quantity: number;
  isInShop: boolean;
};

type Error = {
  productName?: string;
  price?: string;
  quantity?: string;
};

const Stock = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Update produt Stock dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [toUpdateProduct, setToUpdateProduct] = useState('');
  const [errors, setErrors] = useState<Error>({});

  // Number of products per page
  const limit = 3;

  const { token } = useContext(UserContext);

  useEffect(() => {
    const getStock = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:5000/product/stock',
          {
            headers: {
              authorization: token,
            },
            params: { page, limit },
          }
        );
        const { products, totalPages, isAdmin } = response.data;
        setProducts(products);
        setTotalPages(totalPages);
        setIsAdmin(isAdmin);
      } catch (e) {
        console.error('Failed fetch stock');
      }
    };

    setTimeout(() => setLoading(false), 600);
    getStock();
  }, [page, update]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };
  // Update product stock dialog

  const dialogProduct = toUpdateProduct
    ? products.find(({ _id }) => _id === toUpdateProduct)
    : undefined;
  const onDialogSubmit = async (values: Values) => {
    const { productName, price, quantity, isInShop } = values;

    const finalErrors: Error = {};

    if (!productName) {
      finalErrors.productName = 'Empty';
    }

    if (!price) {
      finalErrors.price = 'Empty';
    } else if (isNaN(price)) {
      finalErrors.price = 'Must be a number';
    } else if (price > 10000 || price < 1) {
      finalErrors.price = 'Between 1 and 10 000€';
    }
    if (!quantity) {
      finalErrors.quantity = 'Empty';
    } else if (isNaN(quantity)) {
      finalErrors.quantity = 'Must be a number';
    }
    // A bit weird but i guess final-form and typescript aren't very compatible
    // Since final-form considers quantity as a string even with the value typing
    // For example, typeof quantity returns string...
    else if (
      typeof quantity === 'string' &&
      !Number.isInteger(parseFloat(quantity))
    ) {
      finalErrors.quantity = 'Must be a whole number';
    } else if (quantity > 1000 || quantity < 0) {
      finalErrors.quantity = 'Between 0 and 1000';
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      const data = { productName, price, quantity, isInShop };
      try {
        await axios.put(
          `http://localhost:5000/product/stock/${toUpdateProduct}`,
          data,
          {
            headers: {
              authorization: token,
            },
          }
        );
        // Force component rerender to fetch new informations that we just updated
        setUpdate((prev) => !prev);
        setOpenDialog(false);
      } catch (error) {
        console.error('Failed updating stock product', error);
      }
    }
  };

  return (
    <div className="">
      <p className="text-center text-4xl mt-1">Your Stock</p>

      {loading ? (
        <div className="flex justify-center items-center w-full mt-5 h-96">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <div>
          {products.length > 0 ? (
            <div>
              <div className="mt-5">
                {products.map((product) => (
                  <ProductCard
                    {...product}
                    token={token}
                    setPage={setPage}
                    setUpdate={setUpdate}
                    setOpenDialog={setOpenDialog}
                    setToUpdateProduct={setToUpdateProduct}
                    isAdmin={isAdmin}
                    key={product._id}
                  />
                ))}
              </div>

              <div className="flex justify-center items-center w-full mt-5">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  disabled={totalPages === 1}
                />
              </div>
            </div>
          ) : (
            <div className="h-96 flex justify-center items-center">
              <div className="text-center text-xl mt-10 border-2 border-gray-500 w-200">
                <p>You currently have no products to sell.</p>
                <p>Go to the marketplace to register a new product.</p>
                <Link
                  to="/marketplace"
                  className="underline text-indigo-600 hover:text-indigo-900 transform"
                >
                  {' '}
                  Let's start
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={openDialog}>
        <div className="w-100">
          <DialogTitle>Update stock product</DialogTitle>
          <Form
            onSubmit={onDialogSubmit}
            render={({ handleSubmit, submitting, pristine }) => (
              <form
                onSubmit={handleSubmit}
                className="w-full flex-col flex items-center"
                noValidate
              >
                <div className="m-3 w-3/4">
                  <Field
                    name="productName"
                    component={TextField}
                    type="text"
                    label="Product Name"
                    size="medium"
                    required
                    fullWidth
                    initialValue={dialogProduct?.productName}
                  />
                  {errors?.productName && (
                    <span className="text-red-600 font-bold underline text-sm">
                      {errors.productName}
                    </span>
                  )}
                </div>

                <div className="m-3 w-3/4">
                  <Field
                    name="price"
                    component={TextField}
                    type="text"
                    label="price"
                    size="medium"
                    required
                    fullWidth
                    initialValue={dialogProduct?.price}
                  />

                  {errors?.price && (
                    <span className="text-red-600 font-bold underline text-sm">
                      {errors.price}
                    </span>
                  )}
                </div>

                <div className="m-3 w-3/4">
                  <Field
                    name="quantity"
                    component={TextField}
                    type="text"
                    label="Quantity/ Left to sell"
                    size="medium"
                    required
                    fullWidth
                    initialValue={dialogProduct?.quantity}
                  />

                  {errors?.quantity && (
                    <span className="text-red-600 font-bold underline text-sm">
                      {errors.quantity}
                    </span>
                  )}
                </div>

                <div className="m-3 w-3/4">
                  <Field name="isInShop" initialValue={dialogProduct?.isInShop}>
                    {(props) => (
                      <div>
                        <span>Is available in shop to buy:</span>
                        <Switch
                          // eslint-disable-next-line react/prop-types
                          checked={props.input.value}
                          // eslint-disable-next-line react/prop-types
                          name={props.input.name}
                          // eslint-disable-next-line react/prop-types
                          onChange={props.input.onChange}
                        />
                      </div>
                    )}
                  </Field>
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
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          />
        </div>
      </Dialog>
    </div>
  );
};

const ProductCard = ({
  _id,
  productName,
  price,
  quantity,
  nSold,
  imgUrl,
  token,
  setPage,
  setUpdate,
  setToUpdateProduct,
  setOpenDialog,
  isAdmin,
  isInShop,
}: CardProps) => {
  const handleRemoveClick = async () => {
    try {
      await axios.delete(`http://localhost:5000/product/${_id}`, {
        headers: {
          authorization: token,
        },
      });

      setPage(1);
      // Force component rerender if the page was already page 1
      setUpdate((prev) => !prev);
    } catch (error) {
      console.error('Failed removing product');
    }
  };

  const handleEditClick = () => {
    setToUpdateProduct(_id);
    setOpenDialog(true);
  };
  return (
    <Card className="m-auto w-100 mt-5">
      <div className="flex space-x-3">
        <Link to={`/product/${_id}`}>
          <div className="border-2 border-gray-300 w-26 h-26 m-2">
            <img src={imgUrl} alt="product" height={100} width={100} />
          </div>
        </Link>
        <div>
          <Link
            to={`/product/${_id}`}
            className="text-2xl font-sans hover:text-purple-500"
          >
            {productName}
          </Link>
          <p className="font-sans text-xl font-semibold">{price.toFixed(2)}€</p>
          <p>
            Left to sell: <span className="font-sans">{quantity}</span>
          </p>
          <p>
            Already sold: <span className="font-sans">{nSold}</span>
          </p>

          <p>
            Is the product available in shop to buy: {isInShop ? 'YES' : 'NO'}{' '}
          </p>
        </div>
      </div>
      <div className="text-right mr-5">
        <button
          type="button"
          className="text-xs text-blue-600"
          onClick={handleEditClick}
        >
          Edit
        </button>
        {isAdmin && (
          <button
            type="button"
            className="text-xs text-blue-600"
            onClick={handleRemoveClick}
          >
            Remove from stock
          </button>
        )}
      </div>
    </Card>
  );
};

export default Stock;
