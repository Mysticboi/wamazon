import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  SnackbarCloseReason,
} from '@material-ui/core';
import { Rating, Alert } from '@material-ui/lab';
import { FavoriteBorder } from '@material-ui/icons';
import axios from 'axios';
import { Slide } from 'react-slideshow-image';
import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import { WishListContext } from '../context/WishListContext';
import { CartContext } from '../context/CartContext';
import 'react-slideshow-image/dist/styles.css';

type Product = {
  _id: string;
  productName: string;
  price: number;
  rating: number;
  description: string;
  quantity: number;
  images: [{ imgUrl: string }];
  informations: [
    {
      name: string;
      value: string;
    }
  ];
  reviews: [
    {
      comment: string;
      rating: number;
      name?: string;
    }
  ];
  category: string;
};

// for review form
type Values = {
  name: string;
  rating: number;
  comment: string;
};

type Error = {
  name?: string;
  rating?: string;
  comment?: string;
};

const pages = ['Additionnal Information', 'Reviews'];

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  // Becomes true when we add to cart to display snackbar alert of success
  const [addedToCart, setAddedToCart] = useState(false);

  // For review form
  const [errors, setErrors] = useState<Error>({});
  const [update, setUpdate] = useState(false);

  const { addToWishList } = useContext(WishListContext);
  const { addToCart } = useContext(CartContext);

  const isAvailable = product && product.quantity > 0;

  useEffect(() => {
    document.title = 'Product';
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`/api/product/${productId}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (e) {
        console.error('Failed fetch product');
      }
    };

    getProduct();
  }, [update]);

  const handleClose = (
    event?: React.SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'timeout') {
      setAddedToCart(false);
    }
  };

  const onReviewSubmit = async (values: Values) => {
    const { name, rating, comment } = values;
    const finalErrors: Error = {};
    if (!name) {
      finalErrors.name = 'Empty';
    }
    if (!rating) {
      finalErrors.rating = 'Please select a rating';
    }
    if (!comment) {
      finalErrors.comment = 'Please write a message';
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      try {
        await axios.post(`/api/product/review/${product?._id}`, values);

        // For refetching product with updated review
        setUpdate((prev) => !prev);
      } catch (error) {
        console.error('Failed adding review', error);
      }
    }
  };
  return (
    <div>
      <div className="text-center text-2xl bg-gray-100 h-20 flex justify-center items-center uppercase">
        <p>Shop product</p>
      </div>

      {loading ? (
        <div className="h-96 flex justify-center items-center w-full">
          <CircularProgress color="primary" size={70} />
        </div>
      ) : (
        <div className="w-3/4  m-auto mt-5">
          <div className="flex w-full">
            <div className="w-1/2">
              <Slide easing="ease" duration={2500}>
                {product?.images.map(({ imgUrl }) => (
                  <div
                    className="each-slide flex justify-center items-center"
                    key={imgUrl}
                  >
                    <img alt="" src={imgUrl} width={500} height={500} />
                  </div>
                ))}
              </Slide>
            </div>

            <div className="w-1/2 ml-3">
              <p className="text-3xl">{product?.productName}</p>
              <p className="text-3xl text-red-500 font-sans font-semibold mt-2">
                {product?.price.toFixed(2)}€
              </p>
              <Rating
                value={product?.rating}
                readOnly
                className="mt-5 mb-5"
                precision={0.5}
              />
              <p className="text-lg">{product?.description}</p>

              <div className="w-full h-0.5 bg-gray-200 mt-5 mb-5" />

              <div className="flex text-gray-600 space-x-5">
                <div className="border border-gray-300 pt-4 pb-4">
                  <button
                    type="button"
                    className="mr-3 ml-1"
                    onClick={() => {
                      if (isAvailable && quantity > 1) {
                        setQuantity(quantity - 1);
                      }
                    }}
                  >
                    -
                  </button>
                  <input
                    readOnly
                    value={quantity}
                    className="w-5 cursor-default font-sans"
                    type="text"
                  />
                  <button
                    type="button"
                    className="ml-3 mr-1"
                    onClick={() => {
                      if (isAvailable && quantity < 10) {
                        setQuantity(quantity + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>

                {isAvailable ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (product) {
                        addToCart(
                          productId,
                          product.productName,
                          product.images[0].imgUrl,
                          quantity,
                          product.price
                        );
                        setAddedToCart(true);
                      }
                    }}
                  >
                    Add to cart
                  </Button>
                ) : (
                  <div className="cursor-not-allowed flex justify-center items-center">
                    <Button variant="contained" disabled fullWidth size="large">
                      Out of stock
                    </Button>
                  </div>
                )}

                <IconButton
                  title="Add to wishlist"
                  onClick={() => addToWishList(productId)}
                >
                  <FavoriteBorder fontSize="large" color="secondary" />
                </IconButton>
              </div>

              {product?.category && (
                <p className="text-lg text-gray-600 mt-5">
                  Category: {product.category}
                </p>
              )}
            </div>
          </div>

          <nav className="flex justify-center items-center text-3xl space-x-8 mt-10 font-sans">
            {pages.map((page, index) => {
              const className =
                index === currentPage
                  ? 'font-bold'
                  : 'text-gray-500 hover:text-black ';

              const handleClick = () => {
                setCurrentPage(index);
              };
              return (
                <button
                  type="button"
                  key={page}
                  className={className}
                  onClick={handleClick}
                >
                  {index === 0 ? page : `${page}(${product?.reviews.length})`}
                </button>
              );
            })}
          </nav>

          <div className="w-full h-0.5 bg-gray-200 mt-5 mb-5" />

          {currentPage === 0 && (
            <div>
              {product?.informations?.length ? (
                <div>
                  {product.informations.map(({ name, value }) => (
                    <p key={name} className="text-lg font-sans mt-5">
                      <span className="font-semibold">{name}</span>{' '}
                      <span className="ml-20">{value}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-20 text-xl">
                  No additionnal information provided by the seller.
                </div>
              )}
            </div>
          )}

          {currentPage === 1 && (
            <div className="flex">
              <div className="w-2/3">
                <div>
                  {product?.reviews.map(({ comment, rating, name }) => (
                    <div className="mb-7">
                      <div className="flex">
                        <p className="text-xl w-56">{name || 'Anonymous'}</p>
                        <Rating value={rating} readOnly />
                      </div>

                      <div className="w-3/4 text-lg text-gray-700">
                        {comment}.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/3">
                <p className="text-xl font-semibold">Add a review</p>

                <Form
                  onSubmit={onReviewSubmit}
                  render={({ handleSubmit, form }) => (
                    <form
                      onSubmit={(event) => {
                        handleSubmit(event)?.then(() => form.reset());
                      }}
                      className="w-full flex-col flex"
                      noValidate
                    >
                      <div className="w-40">
                        <Field
                          name="name"
                          component={TextField}
                          type="text"
                          label="Name"
                          size="medium"
                          required
                          fullWidth
                        />
                        {errors?.name && (
                          <span className="text-red-600 font-bold underline text-sm">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        <span>Your rating: </span>
                        <Field name="rating">
                          {(props) => (
                            <div>
                              <Rating
                                // eslint-disable-next-line react/prop-types
                                name={props.input.name}
                                // eslint-disable-next-line react/prop-types
                                value={props.input.value}
                                // eslint-disable-next-line react/prop-types
                                onChange={props.input.onChange}
                              />
                            </div>
                          )}
                        </Field>
                        {errors?.rating && (
                          <span className="text-red-600 font-bold underline text-sm">
                            {errors.rating}
                          </span>
                        )}
                      </div>

                      <div className="mt-5 border border-gray-400 w-full">
                        <Field
                          name="comment"
                          component="textarea"
                          placeholder="Message"
                          className="w-full"
                        />
                      </div>
                      {errors?.comment && (
                        <span className="text-red-600 font-bold underline text-sm">
                          {errors.comment}
                        </span>
                      )}

                      <div className="mt-10">
                        <Button
                          size="large"
                          variant="contained"
                          color="primary"
                          type="submit"
                          className="hover:scale-110 transform mt-5"
                        >
                          Send
                        </Button>
                      </div>
                    </form>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <Snackbar
        open={addedToCart}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Item added to cart
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductPage;
