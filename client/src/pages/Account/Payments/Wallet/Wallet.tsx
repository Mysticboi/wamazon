import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  SnackbarCloseReason,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';

import { UserContext } from '../../../../context/UserContext';
import Balance from './Balance';
import AddBankAccount from './AddBankAccount';
import AddCreditCard from './AddCreditCard';
import visa from '../../../../images/visa.png';

export interface CreditCardT {
  number: string;
  name: string;
  expiry: string;
  _id: string;
}

interface CreditCardProps extends CreditCardT {
  token: string | null;
  setCreditCards: React.Dispatch<React.SetStateAction<CreditCardT[]>>;
}

export interface BankAccountT {
  iban: string;
  bic: string;
  holder: string;
}

interface BankAccountProps extends BankAccountT {
  token: string | null;
  setBankAccount: React.Dispatch<React.SetStateAction<BankAccountT | null>>;
}

const Wallet = () => {
  const [bankAccount, setBankAccount] = useState<BankAccountT | null>(null);
  const [creditCards, setCreditCards] = useState<CreditCardT[]>([]);
  const [loading, setLoading] = useState(true);
  const [successAddBankAccount, setSuccessAddBankAccount] = useState(false);

  const { token } = useContext(UserContext);

  const handleSnackBarClose = (
    event?: React.SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'timeout') {
      setSuccessAddBankAccount(false);
    }
  };

  useEffect(() => {
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

    setTimeout(() => setLoading(false), 1200);

    getBankAccount();
    getCreditCards();
  }, []);

  return (
    <div className="mt-5">
      <div className="w-2/3 mb-10 m-auto">
        <div className="relative left-9 md:left-60">
          <p className="text-3xl">Wallet</p>

          {loading ? (
            <div className="m-auto w-2/3 h-96">
              <div className="m-auto w-3/4 mt-20">
                <CircularProgress color="primary" />
              </div>
            </div>
          ) : (
            <div>
              {bankAccount && (
                <BankAccount
                  {...bankAccount}
                  token={token}
                  setBankAccount={setBankAccount}
                />
              )}

              {creditCards.length > 0 && (
                <div className="w-2/3">
                  <p className="text-xl mt-2 mb-2">Your credit cards</p>

                  {creditCards.map((creditCard) => (
                    <CreditCard
                      {...creditCard}
                      key={creditCard._id}
                      token={token}
                      setCreditCards={setCreditCards}
                    />
                  ))}
                </div>
              )}

              <Balance />

              <p className="text-3xl mt-3">Add a new payment method</p>
              <div className="bg-gray-300 h-0.5 w-3/4 mt-1" />

              {!bankAccount && (
                <AddBankAccount
                  setBankAccount={setBankAccount}
                  setSuccess={setSuccessAddBankAccount}
                />
              )}

              <AddCreditCard setCreditCards={setCreditCards} />

              <Snackbar
                open={successAddBankAccount}
                autoHideDuration={3000}
                onClose={handleSnackBarClose}
              >
                <Alert severity="success" elevation={6} variant="filled">
                  Success adding your bank account
                </Alert>
              </Snackbar>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreditCard = ({
  number,
  expiry,
  name,
  _id,
  token,
  setCreditCards,
}: CreditCardProps) => {
  const handleClick = async () => {
    try {
      await axios.delete(`/api/creditCard/${_id}`, {
        headers: {
          authorization: token,
        },
      });

      setCreditCards((prev) =>
        prev.filter((creditCard) => creditCard._id !== _id)
      );
    } catch (error) {
      console.error('Failed removing address', error);
    }
  };
  return (
    <div className="mt-2">
      <Accordion>
        <div className="bg-gray-200">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel-header"
          >
            <div className="flex space-x-3">
              <img src={visa} alt="visa" width={60} height={60} />
              <span className="text-md font-sans">VISA: {number}</span>
            </div>
          </AccordionSummary>
        </div>

        <AccordionDetails>
          <div className="font-sans w-full  mt-1   relative h-8">
            <p className="absolute left-5">Name on the card: {name}</p>
            <p className="absolute left-1/2">Date of expiry: {expiry}</p>
            <button
              type="button"
              className="absolute right-5 text-purple-500 underline"
              onClick={handleClick}
            >
              Delete
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const BankAccount = ({
  iban,
  bic,
  holder,
  token,
  setBankAccount,
}: BankAccountProps) => {
  const handleClick = async () => {
    try {
      await axios.delete(`/api/bankAccount`, {
        headers: {
          authorization: token,
        },
      });

      setBankAccount(null);
    } catch (error) {
      console.error('Failed removing address', error);
    }
  };
  return (
    <div className="w-2/3">
      <p className="text-xl mt-2 mb-2">Your bank account</p>

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
            <button
              type="button"
              className="absolute right-5 text-purple-500 underline"
              onClick={handleClick}
            >
              Delete
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Wallet;
