import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { UserContext } from '../../../../context/UserContext';
import Balance from './Balance';
import AddBankAccount from './AddBankAccount';

type BankAccountT = {
  iban: string;
  bic: string;
  holder: string;
};

const Wallet = () => {
  const [bankAccount, setBankAccount] = useState<BankAccountT | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(UserContext);

  console.log(bankAccount);

  useEffect(() => {
    const getBankAccount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/bankAccount', {
          headers: {
            authorization: token,
          },
        });
        setBankAccount(response.data.bankAccount);
        // setLoading(false);
      } catch (e) {
        setBankAccount(null);
        console.error('Failed getBalance', e);
      }
    };

    setTimeout(() => setLoading(false), 1200);

    getBankAccount();
  }, []);
  return (
    <div className="mt-5">
      <div className="w-2/3 mb-10 m-auto">
        <div className="relative left-9 md:left-60">
          <p className="text-3xl">Wallet</p>

          {loading ? (
            <div className="m-auto w-2/3">
              <div className="m-auto w-3/4 mt-20">
                <CircularProgress color="primary" />
              </div>
            </div>
          ) : (
            <div>
              {bankAccount && <BankAccount {...bankAccount} />}

              <Balance />

              <p className="text-3xl mt-3">Add a new payment method</p>
              <div className="bg-gray-300 h-0.5 w-3/4 mt-1" />

              {!bankAccount && <AddBankAccount />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BankAccount = ({ iban, bic, holder }: BankAccountT) => (
  <div className="w-2/3">
    <p className="text-xl mt-2 mb-2">Your bank account</p>
    {/* <div className="font-sans w-full border-2 mt-1 border-gray-500 bg-gray-300 relative h-8">
      <p className="absolute left-5">Iban: {iban}</p>
      <p className="absolute left-1/2">Bic: {bic}</p>
      <p className="absolute right-5">Holder: {holder}</p>
    </div> */}

    <Accordion>
      <div className="bg-gray-200">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <p className="text-md">Holder: {holder}</p>
        </AccordionSummary>
      </div>

      <AccordionDetails>
        <div className="font-sans w-full  mt-1   relative h-8">
          <p className="absolute left-5">IBAN: {iban}</p>
          <p className="absolute left-1/2">BIC: {bic}</p>
        </div>
      </AccordionDetails>
    </Accordion>
  </div>
);

export default Wallet;
