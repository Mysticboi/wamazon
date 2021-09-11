import React, { useState, useEffect, useContext } from 'react';
import { Card, CircularProgress } from '@material-ui/core';
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
}
interface CardProps extends Product {
  token: string | null;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const Stock = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

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
        const { products, totalPages } = response.data;
        setProducts(products);
        setTotalPages(totalPages);
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
  return (
    <Card className="m-auto w-100 mt-5">
      <div className="flex space-x-3">
        <div className="border-2 border-gray-300 w-26 h-26 m-2">
          <img src={imgUrl} alt="product" height={100} width={100} />
        </div>
        <div>
          <p className="text-2xl font-sans">{productName}</p>
          <p className="font-sans text-xl font-semibold">{price.toFixed(2)}€</p>
          <p>
            Left to sell: <span className="font-sans">{quantity}</span>
          </p>
          <p>
            Already sold: <span className="font-sans">{nSold}</span>
          </p>
        </div>
      </div>
      <div className="text-right mr-5">
        <button type="button" className="text-xs text-blue-600">
          Edit
        </button>
        |
        <button
          type="button"
          className="text-xs text-blue-600"
          onClick={handleRemoveClick}
        >
          Remove from stock
        </button>
      </div>
    </Card>
  );
};

export default Stock;
