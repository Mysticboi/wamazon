import React, { useEffect } from 'react';
import {
  useRouteMatch,
  Switch,
  Route,
  useLocation,
  Link,
} from 'react-router-dom';
import Wallet from './Wallet/Wallet';
import Transactions from './Transactions';
import giftCard from '../../../images/giftCard.png';

const PaymentsNavBar = () => {
  const { pathname } = useLocation();
  let pos = 0;
  switch (pathname) {
    case '/account/payments/wallet':
      pos = 1;
      break;
    case '/account/payments/transactions':
      pos = 2;
      break;
    default:
      pos = 0;
      break;
  }
  return (
    <div className="mt-5">
      <div className="w-2/3 mb-10 m-auto">
        <div className="relative left-5 md:left-56">
          <p className="text-3xl">Your Payments</p>
        </div>

        <div className="relative left-9 md:left-60 mt-5">
          <div className="space-x-20 flex">
            {pos === 0 ? (
              <span className="w-16 font-bold">Presentation</span>
            ) : (
              <Link
                to="/account/payments"
                className="w-16 text-blue-600 hover:text-purple-500 hover:underline"
              >
                Presentation
              </Link>
            )}

            {pos === 1 ? (
              <span className="w-8 font-bold">Wallet</span>
            ) : (
              <Link
                to="/account/payments/wallet"
                className="w-8 text-blue-600 hover:text-purple-500 hover:underline"
              >
                Wallet
              </Link>
            )}
            {pos === 2 ? (
              <span className="w-18 font-bold">Transactions</span>
            ) : (
              <Link
                to="/account/payments/transactions"
                className="w-18 text-blue-600 hover:text-purple-500 hover:underline"
              >
                Transactions
              </Link>
            )}
          </div>

          <div className="space-x-16 flex absolute mt-0.5">
            <div
              className={
                pos === 0 ? 'h-1 w-20 bg-purple-500' : 'h-0.5 w-20 bg-gray-300'
              }
            />
            <div
              className={
                pos === 1 ? 'h-1 w-12 bg-purple-500' : 'h-0.5 w-12 bg-gray-300'
              }
            />
            <div
              className={
                pos === 2 ? 'h-1 w-20 bg-purple-500' : 'h-0.5 w-20 bg-gray-300'
              }
            />
          </div>

          <div className="mt-0.5">
            <div className="h-0.5 bg-gray-300 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Presentation = () => (
  <div className="m-auto w-2/3">
    <div className="relative left-9 md:left-60">
      <p className="text-2xl">Presentation</p>
      <div className="mt-7 w-3/4 p-3 border-2 rounded-xl border-gray-300 relative">
        <div className="flex">
          <img src={giftCard} alt="giftCard" height={40} width={40} />
          <p className="ml-2">Wamazon Gift Card</p>
        </div>
        <Link to="payments/wallet" className="text-blue-600 text-sm ml-14">
          Go to wallet
        </Link>
      </div>
    </div>
  </div>
);

const Payments = () => {
  const { path } = useRouteMatch();

  useEffect(() => {
    document.title = 'Your payments';
  }, []);
  return (
    <>
      <PaymentsNavBar />

      <Switch>
        <Route exact path={path}>
          <Presentation />
        </Route>

        <Route path={`${path}/wallet`}>
          <Wallet />
        </Route>

        <Route path={`${path}/transactions`}>
          <Transactions />
        </Route>
      </Switch>
    </>
  );
};

export default Payments;
