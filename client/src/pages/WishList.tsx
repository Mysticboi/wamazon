import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, IconButton } from '@material-ui/core';
import { FavoriteBorder, Close } from '@material-ui/icons';
import { WishListContext } from '../context/WishListContext';

interface Product {
  _id: string;
  productName: string;
  price: number;
  imgUrl: string;
}

interface CardProps extends Product {
  handleClickRemove: (productId: string) => void;
}

const WishList = () => {
  const { wishList, wishListLength, removeFromWishList, clearWishList } =
    useContext(WishListContext);

  const [products, setProducts] = useState<Product[]>([]);

  const history = useHistory();

  console.log(products);

  useEffect(() => {
    document.title = 'Wishlist';
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/product/wishList',
          {
            params: { productIds: wishList },
          }
        );

        setProducts(response.data.products);
      } catch (e) {
        console.error('Failed fetch products');
      }
    };

    getProducts();
  }, []);

  const handleClickRemove = (productId: string) => {
    removeFromWishList(productId);
    const newProducts = products.filter(({ _id }) => _id !== productId);
    setProducts(newProducts);
  };

  const handleClickClear = () => {
    setProducts([]);
    clearWishList();
  };

  return (
    <div>
      <div className="text-center text-2xl bg-gray-100 h-20 flex justify-center items-center">
        <p>Your Wishlist</p>
      </div>

      {wishListLength > 0 ? (
        <div className="w-2/3 m-auto font-sans mt-10">
          <p className="text-xl font-semibold mb-3">Your wishlist items</p>
          <div className="border border-gray-300">
            <div className="uppercase relative h-14  bg-gray-100">
              <span className="absolute left-5 top-3">image</span>
              <span className="absolute left-1/4 top-3">product name</span>
              <span className="absolute right-1/4 top-3">unit price</span>
              <span className="absolute right-5 top-3">actions</span>
            </div>
          </div>

          <div>
            {products.map((product) => (
              <ProductCard
                {...product}
                handleClickRemove={handleClickRemove}
                key={product._id}
              />
            ))}
          </div>
          <div className="mt-5">
            <div className="text-left h-0">
              <Button
                color="primary"
                variant="contained"
                onClick={() => history.push('/shop')}
              >
                Continue shopping
              </Button>
            </div>

            <div className="text-right">
              <Button
                color="secondary"
                variant="contained"
                onClick={handleClickClear}
              >
                Clear wishlist
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center  h-96 space-y-5">
          <div className="mt-5">
            <FavoriteBorder style={{ fontSize: 200 }} />
          </div>
          <p className="text-2xl">Your wishlist is empty</p>

          <Link to="shop">
            <div className="border-2 h-12 border-black text-lg p-4 bg-black text-white shadow-md  w-40 m-auto flex justify-center items-center hover:bg-purple-500 hover:border-purple-500 hover:text-white">
              Add items
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({
  _id,
  productName,
  price,
  imgUrl,
  handleClickRemove,
}: CardProps) => {
  const history = useHistory();
  return (
    <div className="border border-gray-300 relative h-36">
      <div className="absolute left-5 top-3 w-32 h-32 flex justify-center items-center">
        <img alt="" src={imgUrl} width={100} />
      </div>

      <div className="absolute left-1/4 top-12">
        <p>{productName}</p>
      </div>

      <div className="absolute right-1/4 top-12">
        <p>{price.toFixed(2)}€</p>
      </div>

      <div className="absolute right-14 top-12">
        <Button
          color="primary"
          variant="contained"
          onClick={() => history.push(`/product/${_id}`)}
        >
          View
        </Button>
      </div>

      <div className="absolute right-2 top-11">
        <IconButton onClick={() => handleClickRemove(_id)}>
          <Close style={{ color: 'red' }} />
        </IconButton>
      </div>
    </div>
  );
};

export default WishList;
