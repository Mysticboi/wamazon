import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Add } from '@material-ui/icons';
import {
  useRouteMatch,
  Switch,
  Route,
  useHistory,
  Link,
} from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import AddAddress from './AddAddress';
import UpdateAddress from './UpdateAddress';

export interface Address {
  address: string;
  city: string;
  country: string;
  region: string;
  zipCode: number;
  phoneNumber: number;
  _id?: string;
}

interface CardProps extends Address {
  token: string | null;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

const AddressesPage = ({ path }: { path: string }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { token } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    document.title = 'Your Addresses';
  }, []);

  useEffect(() => {
    const getAddresses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/address', {
          headers: {
            authorization: token,
          },
        });
        const { addresses }: { addresses: Address[] } = response.data;
        console.log('addresess', addresses);
        setAddresses(addresses);
      } catch (error) {
        console.error('Failed fetch addresses:', error);
      }
    };

    getAddresses();
  }, [token]);

  const className =
    addresses.length === 0
      ? 'flex space-x-4 m-auto w-80'
      : 'flex flex-wrap m-auto max-w-2xl';

  return (
    <div className="mt-5">
      <div className="w-2/3 mb-10 m-auto">
        <p className="text-4xl relative text-center">Your Addresses</p>
      </div>

      <div className={className}>
        <div
          className="border-2 border-dashed border-gray-300 w-80 h-60 justify-center items-center flex flex-col cursor-pointer m-1"
          role="presentation"
          onClick={() => history.push(`${path}/addAddress`)}
        >
          <Add color="primary" style={{ fontSize: 80 }} />
          <p className="text-2xl text-center text-blue-500">Add Address</p>
        </div>

        {addresses.map((address) => (
          <AddressCard
            {...address}
            key={address._id}
            token={token}
            addresses={addresses}
            setAddresses={setAddresses}
          />
        ))}
      </div>
    </div>
  );
};

const AddressCard = ({
  _id,
  address,
  city,
  country,
  region,
  zipCode,
  phoneNumber,
  token,
  addresses,
  setAddresses,
}: CardProps) => {
  const { path } = useRouteMatch();
  const handleClick = async () => {
    try {
      await axios.delete(`http://localhost:5000/user/address/${_id}`, {
        headers: {
          authorization: token,
        },
      });

      setAddresses([...addresses.filter((address) => address._id !== _id)]);
    } catch (error) {
      console.error('Failed removing address', error);
    }
  };

  return (
    <div className="border-2 border-gray-300 w-80 h-60 m-1 font-sans">
      <div className="ml-3">
        <p>{address}</p>
        <p>{`${region}, ${city} ${zipCode}`}</p>
        <p>{country}</p>
        <p>Phone number: {phoneNumber}</p>
        <div className="relative top-24">
          <Link to={`${path}/${_id}`} className="text-blue-600">
            Edit
          </Link>{' '}
          |{' '}
          <button className="text-blue-600" type="button" onClick={handleClick}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Addresses = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <AddressesPage path={path} />
      </Route>

      <Route path={`${path}/addAddress`}>
        <AddAddress />
      </Route>

      <Route path={`${path}/:addressId`}>
        <UpdateAddress />
      </Route>
    </Switch>
  );
};

export default Addresses;
