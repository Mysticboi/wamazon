import React from 'react';
import Balance from './Balance';
import AddBankAccount from './AddBankAccount';

const Wallet = () => (
  <div className="mt-5">
    <div className="w-2/3 mb-10 m-auto">
      <div className="relative left-9 md:left-60">
        <p className="text-3xl">Wallet</p>

        <Balance />

        <p className="text-3xl mt-3">Add a new payment method</p>
        <div className="bg-gray-300 h-0.5 w-3/4 mt-1" />

        <AddBankAccount />
      </div>
    </div>
  </div>
);

const BankAccount = () => <div>Bank Accounts</div>;

export default Wallet;
