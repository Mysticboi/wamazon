import React, { useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Close, ShoppingCartOutlined } from '@material-ui/icons';
import { IconButton, Button } from '@material-ui/core';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const {
    cart,
    cartLength,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useContext(CartContext);

  const history = useHistory();

  useEffect(() => {
    document.title = 'Cart';
  }, []);
  return (
    <div>
      <div className="text-center text-2xl bg-gray-100 h-20 flex justify-center items-center">
        <p>CART</p>
      </div>

      {cartLength > 0 ? (
        <div className="w-3/4 m-auto font-sans mt-16">
          <p className="text-2xl mb-5">Your cart items</p>
          <div className="overflow-x-auto">
            <div className="w-300">
              <table className="table-fixed w-full">
                <thead className="uppercase font-normal bg-gray-100 px-4 py-2 border border-gray-500 h-20">
                  <tr>
                    <th className="w-40">Image</th>
                    <th className="w-72">Product Name</th>
                    <th className="w-40">Unit price</th>
                    <th className="w-52">Qty</th>
                    <th className="w-20">Subtotal</th>
                    <th className="w-40">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(({ _id, productName, price, quantity, imgUrl }) => (
                    <tr key={_id}>
                      <td className="border border-gray-500 px-4 py-2 font-medium">
                        <Link to={`/product/${_id}`}>
                          <img alt="" src={imgUrl} width={200} height={200} />
                        </Link>
                      </td>

                      <td className="border border-gray-500 px-4 py-2 font-medium">
                        <div className="flex justify-center items-center text-xl">
                          <Link
                            to={`/product/${_id}`}
                            className="hover:text-purple-500"
                          >
                            {productName}
                          </Link>
                        </div>
                      </td>

                      <td className="border border-gray-500 px-4 py-2 font-medium">
                        {price.toFixed(2)}€{' '}
                      </td>

                      <td className="border border-gray-500 px-4 py-2 font-medium">
                        <div className="flex justify-center items-center">
                          <div className="border border-gray-300 pt-4 pb-4 w-20">
                            <button
                              type="button"
                              className="mr-3 ml-1"
                              onClick={() => {
                                if (quantity > 1) {
                                  updateQuantity(_id, quantity - 1);
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
                                  updateQuantity(_id, quantity + 1);
                                }
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="border border-gray-500 px-4 py-2 font-medium">
                        {(price * quantity).toFixed(2)}€{' '}
                      </td>

                      <td className="border border-gray-500 px-4 py-2 font-medium">
                        <div className="flex justify-center items-center space-x-5">
                          <Link to={`/product/${_id}`}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="large"
                            >
                              View
                            </Button>
                          </Link>
                          <IconButton onClick={() => removeFromCart(_id)}>
                            <Close style={{ color: 'red' }} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="max-w-full mt-2 relative">
            {' '}
            <div className="text-left h-0">
              <Button
                color="primary"
                variant="contained"
                onClick={() => history.push('/shop')}
              >
                Continue shopping
              </Button>
            </div>
            <div className="absolute right-6">
              <Button
                color="secondary"
                variant="contained"
                onClick={() => clearCart()}
              >
                Clear shopping cart
              </Button>
            </div>
          </div>
          <div className="flex justify-center items-center mt-10">
            <div className="w-96 h-32 border border-gray-500 bg-gray-200 p-5">
              <div className="text-2xl font-semibold">
                <p className="h-0">Cart total:</p>
                <p className="text-right">{totalPrice.toFixed(2)}€</p>
              </div>

              <div className="h-0.5 bg-black mb-6" />
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => history.push('/checkout')}
              >
                proceed to checkout
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center  h-96 space-y-5">
          <div className="mt-5">
            <ShoppingCartOutlined style={{ fontSize: 200 }} />
          </div>
          <p className="text-2xl">Your cart is empty</p>

          <Link to="shop">
            <div className="border-2 h-12 border-black text-lg p-4 bg-black text-white shadow-md  w-40 m-auto flex justify-center items-center hover:bg-purple-500 hover:border-purple-500 font-semibold font-sans">
              Shop now
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
