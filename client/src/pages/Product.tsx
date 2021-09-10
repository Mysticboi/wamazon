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
import { WishListContext } from '../context/WishListContext';
import { CartContext } from '../context/CartContext';
import 'react-slideshow-image/dist/styles.css';

type Product = {
  _id: string;
  productName: string;
  price: number;
  rating: number;
  description: string;
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
    }
  ];
  category: string;
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

  const { addToWishList } = useContext(WishListContext);
  const { addToCart } = useContext(CartContext);

  console.log('product', product);

  useEffect(() => {
    document.title = 'Product';
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/product/${productId}`
        );
        setProduct(response.data.product);
        setLoading(false);
      } catch (e) {
        console.error('Failed fetch product');
      }
    };

    getProduct();
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'timeout') {
      setAddedToCart(false);
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
                  <div className="each-slide flex justify-center items-center">
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
              <Rating value={product?.rating} readOnly className="mt-5 mb-5" />
              <p className="text-lg">{product?.description}</p>

              <div className="w-full h-0.5 bg-gray-200 mt-5 mb-5" />

              <div className="flex text-gray-600 space-x-5">
                <div className="border border-gray-300 pt-4 pb-4">
                  <button
                    type="button"
                    className="mr-3 ml-1"
                    onClick={() => {
                      if (quantity > 1) {
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
                      if (quantity < 10) {
                        setQuantity(quantity + 1);
                      }
                    }}
                  >
                    +
                  </button>
                </div>

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
                  {page}
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
