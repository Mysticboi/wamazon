import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

interface Product {
  _id: string;
  productName: string;
  price: number;
  quantity: number;
  imgUrl: string;
}

interface Order {
  _id: string;
  date: Date;
  totalAmount: number;
  products: Product[];
  addressOfDelivery: string;
}

const Orders = () => {
  const { token } = useContext(UserContext);

  const [orders, setOrders] = useState<Order[]>([]);

  console.log(orders);

  useEffect(() => {
    document.title = 'Your orders';
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/order', {
          headers: {
            authorization: token,
          },
        });

        setOrders(response.data.orders);
      } catch (error) {
        console.error('Failed fetch addresses:', error);
      }
    };

    getOrders();
  }, []);
  return (
    <div>
      <p className="text-center text-4xl mt-1">Your Orders</p>
      {orders.length > 0 ? (
        <div className="w-3/4 m-auto mt-8">
          {orders.map(
            ({ _id, date, totalAmount, addressOfDelivery, products }) => (
              <div key={_id} className="mt-5 mb-5">
                <div className="border border-gray-600 p-1  rounded-xl bg-gray-300 flex space-x-5 justify-center items-center flex-wrap">
                  <div>
                    <p className="uppercase">Date of order: </p>
                    <p className="font-sans">{date}</p>
                  </div>

                  <div>
                    <p className="uppercase">Total:</p>
                    <p className="font-sans">{totalAmount.toFixed(2)}€</p>
                  </div>

                  <div className="w-200">
                    <p className="uppercase">Address of delivery: </p>
                    <p className="font-sans">{addressOfDelivery}</p>
                  </div>

                  <div>
                    <p className="uppercase">Order reference:</p>
                    <p className="font-sans">{_id}</p>
                  </div>
                </div>

                <div>
                  {products.map(
                    ({ _id, productName, price, quantity, imgUrl }) => (
                      <div className="border border-gray-500 px-4 py-2 flex space-x-20 flex-wrap items-center">
                        <td className="font-medium h-32 w-32">
                          <Link to={`/product/${_id}`}>
                            <img alt="" src={imgUrl} />
                          </Link>
                        </td>

                        <td className="font-medium">
                          <div className="flex justify-center items-center text-xl">
                            <p className="font-sans">
                              Product Name:{' '}
                              <Link
                                to={`/product/${_id}`}
                                className="hover:text-purple-500"
                              >
                                {productName}
                              </Link>{' '}
                            </p>
                          </div>
                        </td>

                        <td className="font-medium font-sans">
                          Unit price: {price.toFixed(2)}€{' '}
                        </td>

                        <td className="font-sans">Quantity: X{quantity}</td>

                        <td className="font-sans">
                          SubTotal: {(quantity * price).toFixed(2)}€
                        </td>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="h-96 flex justify-center items-center">
          <div className="text-center text-xl mt-10 border-2 border-gray-500 w-200">
            <p>You haven't made any orders yet</p>
            <p>Visit the shop to find what you need. </p>
            <Link
              to="/shop"
              className="underline text-indigo-600 hover:text-indigo-900 transform"
            >
              {' '}
              Go to shop
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
