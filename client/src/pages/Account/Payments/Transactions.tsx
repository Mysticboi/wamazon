import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../../context/UserContext';

interface Transaction {
  date: string;
  totalAmount: number;
  paymentMethod: {
    type: string;
    value: string;
  };
}

const Transactions = () => {
  const { token } = useContext(UserContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/order/transaction',
          {
            headers: {
              authorization: token,
            },
          }
        );

        setTransactions(response.data.transactions);
      } catch (e) {
        console.error('Failed fetch transactions');
      }
    };

    getTransactions();
  }, []);
  return (
    <div className="mt-5">
      <div className="w-2/3 mb-10 m-auto">
        <div className="relative left-9 md:left-60">
          <p className="text-3xl">Transactions</p>
          <p className="mt-5 mb-5">
            Here you'll find all the payments where you used a credit card or a
            bank account
          </p>

          {transactions.length > 0 ? (
            <div className="w-2/3 text-xl">
              {transactions.map(({ date, totalAmount, paymentMethod }) => (
                <div
                  className="border border-gray-500 p-2 rounded-xl mt-5"
                  key={date + totalAmount}
                >
                  <div className="bg-gray-200">{date}</div>
                  <div>
                    <span>
                      <span className="font-bold">
                        {paymentMethod.type === 'bankAccount'
                          ? 'Bank Account: '
                          : 'VISA / Credit Card:'}
                      </span>
                      {'  '}
                      <span className="font-sans">{paymentMethod.value}</span>
                    </span>

                    <span className="font-sans font-bold float-right text-xl">
                      -{totalAmount.toFixed(2)}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-2/3 h-32 mt-10">
              <p className="text-2xl text-center">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
