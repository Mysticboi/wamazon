import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CircularProgress,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Dialog,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';

// Types/Interfaces
import { Address } from './Account/Addresses/Addresses';
import { CreditCardT, BankAccountT } from './Account/Payments/Wallet/Wallet';

type Error = {
  address?: string;
  payment?: string;
};

const Checkout = () => {
  const { isUserConnected, token } = useContext(UserContext);
  const { cart, totalPrice, clearCart } = useContext(CartContext);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [bankAccount, setBankAccount] = useState<BankAccountT | null>(null);
  const [creditCards, setCreditCards] = useState<CreditCardT[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Index of chosen address
  const [address, setAddress] = useState(-1);
  // Type of payment
  const [payment, setPayment] = useState('');
  const [errors, setErrors] = useState<Error>({});
  const [open, setOpen] = useState(false);

  const history = useNavigate();

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const response = await axios.get('/api/user/address', {
          headers: {
            authorization: token,
          },
        });
        const { addresses }: { addresses: Address[] } = response.data;
        setAddresses(addresses);
      } catch (error) {
        console.error('Failed fetch addresses:', error);
      }
    };

    const getBankAccount = async () => {
      try {
        const response = await axios.get('/api/bankAccount', {
          headers: {
            authorization: token,
          },
        });
        setBankAccount(response.data.bankAccount);
        // setLoading(false);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          setBankAccount(null);
          if (e?.response?.status === 404) {
            console.log("User hasn't added a bank account yet");
          } else {
            console.error('Failed getBalance', e);
          }
        }
      }
    };

    const getCreditCards = async () => {
      try {
        const response = await axios.get('/api/creditCard', {
          headers: {
            authorization: token,
          },
        });
        setCreditCards(response.data.creditCards);
        // setLoading(false);
      } catch (e) {
        setCreditCards([]);
        console.error('Failed getCreditCards', e);
      }
    };

    const getBalance = async () => {
      try {
        const response = await axios.get('/api/user/balance', {
          headers: {
            authorization: token,
          },
        });
        setBalance(response.data.balance);
      } catch (e) {
        console.error('Failed getBalance', e);
      }
    };

    setTimeout(() => setLoading(false), 1200);

    getAddresses();
    getBankAccount();
    getCreditCards();
    getBalance();
  }, []);

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(parseInt(event.target.value, 10));
  };

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPayment(event.target.value);
  };

  const handleClick = async () => {
    const finalErrors: Error = {};

    if (addresses.length === 0) {
      finalErrors.address = 'Please add an address of delivery';
    } else if (address === -1) {
      finalErrors.address = 'Please choose an address of delivery';
    }

    if (!payment) {
      finalErrors.payment = 'Please choose a payment method';
    }

    setErrors(finalErrors);

    if (Object.keys(finalErrors).length === 0) {
      // No errors we continue
      try {
        const data = {
          payment,
          address,
          products: cart,
          totalAmount: totalPrice,
        };
        await axios.post('/api/order', data, {
          headers: {
            authorization: token,
          },
        });

        setOpen(true);
        setTimeout(() => {
          history('/');
          clearCart();
        }, 1500);
      } catch (error) {
        console.error('Failed placing order', error);
      }
    }
  };

  return (
    <div>
      <div className="text-center text-2xl bg-gray-100 h-20 flex justify-center items-center">
        <p>Checkout</p>
      </div>

      {isUserConnected ? (
        <div id="connected">
          {loading ? (
            <Loading />
          ) : (
            <div id="ready" className="flex space-x-5 mt-5">
              <div className="w-2/3 bg-gray-300 ml-7">
                <div>
                  <p className="text-2xl">Choose an address</p>

                  <div className="ml-5 mt-4">
                    {addresses.length > 0 ? (
                      <div>
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="address"
                            value={address}
                            onChange={handleAddressChange}
                          >
                            {addresses.map(
                              (
                                {
                                  _id,
                                  address,
                                  city,
                                  country,
                                  zipCode,
                                  phoneNumber,
                                },
                                i
                              ) => (
                                <FormControlLabel
                                  value={i}
                                  control={<Radio color="primary" />}
                                  key={_id}
                                  label={`${address}, ${city}, ${zipCode}, ${country}, Phone number: ${phoneNumber}`}
                                />
                              )
                            )}
                          </RadioGroup>
                        </FormControl>
                      </div>
                    ) : (
                      <p className="text-center text-xl">
                        No addresses registered for your account.{'  '}
                        <Link
                          to="/account/addresses/addAddress"
                          className="text-purple-500 underline"
                        >
                          Add address
                        </Link>
                      </p>
                    )}

                    {errors?.address && (
                      <span className="text-red-600 font-bold underline text-sm">
                        {errors.address}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-2xl mt-5">Choose a payment method</p>

                  <div className="mt-5 ml-4">
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="payment"
                        value={payment}
                        onChange={handlePaymentChange}
                      >
                        <div id="balance-radio">
                          <FormControlLabel
                            value="balance"
                            control={
                              <Radio
                                color="primary"
                                disabled={balance < totalPrice}
                              />
                            }
                            label={`Wamazon Balance: ${balance.toFixed(2)} €`}
                          />
                          {balance < totalPrice && (
                            <span className="text-red-500">
                              Not enough balance.{' '}
                              <Link
                                to="/account/payments/wallet"
                                className="text-purple-500 underline"
                              >
                                Charge your balance
                              </Link>
                            </span>
                          )}
                        </div>

                        <div id="creditCards">
                          <p className="text-lg">Credit Cards</p>

                          {creditCards.length > 0 ? (
                            <div>
                              {creditCards.map(
                                ({ number, expiry, name }, i) => (
                                  <FormControlLabel
                                    value={`creditCard${i}`}
                                    key={number + expiry}
                                    control={<Radio color="primary" />}
                                    label={`${number}, expires on ${expiry}, holder: ${name}`}
                                  />
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-center text-xl mt-4 ml-5">
                              No credit cards registred to your account.{'  '}
                              <Link
                                to="/account/payments/wallet"
                                className="text-purple-500 underline"
                              >
                                Add credit card
                              </Link>
                            </p>
                          )}
                        </div>

                        <div id="bankAccount" className="mt-5">
                          <p className="text-lg">Bank Account</p>
                          {bankAccount ? (
                            <div>
                              <FormControlLabel
                                value="bankAccount"
                                control={<Radio color="primary" />}
                                label={`${bankAccount.iban}, holder: ${bankAccount.holder}`}
                              />
                            </div>
                          ) : (
                            <p className="text-center text-xl mt-4 ml-5">
                              No bank account registred to your account.{'  '}
                              <Link
                                to="/account/payments/wallet"
                                className="text-purple-500 underline"
                              >
                                Add bank account
                              </Link>
                            </p>
                          )}
                        </div>
                      </RadioGroup>
                    </FormControl>

                    {errors?.payment && (
                      <p className="text-red-600 font-bold underline text-sm">
                        {errors.payment}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-1/3 font-sans">
                <p className="text-2xl font-semibold mb-5"> Your Order</p>

                <div className="text-xl bg-gray-200 p-10">
                  <div className="font-semibold">
                    <span>Product</span>
                    <span className="float-right">Subtotal</span>
                  </div>

                  <div className="h-0.5 bg-gray-300 mt-5 mb-5" />

                  <div className="text-lg">
                    {cart.map(({ productName, quantity, price, _id }) => (
                      <div key={_id}>
                        <span>
                          {productName} X {quantity}
                        </span>
                        <span className="float-right">
                          {(price * quantity).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-0.5 bg-gray-300 mt-5 mb-5" />

                  <div>
                    <span>Shipping</span>
                    <span className="float-right">Free shipping</span>
                  </div>

                  <div className="h-0.5 bg-gray-300 mt-5 mb-5" />

                  <div className="text-3xl font-semibold">
                    <span>Total</span>
                    <span className="float-right text-purple-500">
                      {totalPrice.toFixed(2)}€
                    </span>
                  </div>

                  <div className="h-0.5 bg-gray-300 mt-5 mb-5" />

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleClick}
                  >
                    Place order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Unconnected />
      )}

      <Dialog open={open}>
        <div className="">
          <Alert
            severity="success"
            variant="filled"
            className="text-xl"
            style={{ fontSize: 20 }}
          >
            Success placing order, moving to home...
          </Alert>
        </div>
      </Dialog>
    </div>
  );
};

const Loading = () => (
  <div id="loading" className="h-96 flex justify-center items-center">
    <CircularProgress />
  </div>
);

const Unconnected = () => (
  <div id="unconnected" className="flex justify-center items-center h-96">
    <div className="text-center mt-10 text-xl border border-gray-500 p-5">
      <p>
        You must be connected to continue.{' '}
        <Link
          to="/login"
          className="underline text-indigo-600 hover:text-indigo-900 transform"
        >
          Login
        </Link>{' '}
      </p>

      <p className="mt-5">
        Don't have an account yet? Sign up and start buying whatever you need.{' '}
        <Link
          to="/signup"
          className="underline text-indigo-600 hover:text-indigo-900 transform"
        >
          Sign up
        </Link>{' '}
      </p>
    </div>
  </div>
);
export default Checkout;
