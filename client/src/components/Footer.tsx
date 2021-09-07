import React from 'react';
import { Link } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import { GitHub } from '@material-ui/icons';

const Footer = () => (
  <div className="w-full">
    <div className="w-full h-96 bg-gray-100 mt-20 font-sans flex justify-center items-center space-x-20 flex-wrap">
      <div className="h-36 space-y-1">
        <div className="text-3xl font-bold text-purple-500 uppercase">
          <Link to="/">Wamazon.</Link>
        </div>

        <p>© 2021 Wamazon.</p>
        <p>All Rights Reserved</p>
        <p>
          Made by{' '}
          <a
            href="https://github.com/Mysticboi"
            className="text-purple-500 underline"
            target="_blank"
            rel="noreferrer"
          >
            Walid
          </a>
          {'  '}
          <GitHub />
        </p>
      </div>

      <div className="flex flex-col items-start h-32 space-y-3">
        <p className="uppercase text-lg">About us</p>

        <Button>About Us</Button>
        <Button>Store location</Button>
        <Link to="/contact" className="hover:text-purple-500 text-gray-600">
          Contact
        </Link>
        <Button>Orders tracking</Button>
      </div>

      <div className="flex flex-col items-start h-32 space-y-3">
        <p className="uppercase text-lg">Useful links</p>

        <Button>Returns</Button>
        <Button>Support Policy</Button>
        <Button>Size guide</Button>
        <Button>FAQs</Button>
      </div>

      <div className="flex flex-col items-start h-32 space-y-3">
        <p className="uppercase text-lg">Follow us</p>

        <a
          href="https://www.facebook.com/walid.oulderra"
          className="hover:text-purple-500 text-gray-600"
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>

        <a
          href="https://github.com/Mysticboi"
          className="hover:text-purple-500 text-gray-600"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>

        <a
          href="https://www.instagram.com/"
          className="hover:text-purple-500 text-gray-600"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
      </div>

      <div className="h-32 w-64">
        <p className="text-lg uppercase">Subscribe</p>
        <p className="text-gray-600 mt-2">
          Get E-mail updates about our latest shop and special offers.
        </p>

        <div className="mt-5">
          <TextField
            placeholder="Enter your email address..."
            fullWidth
            type="email"
          />
        </div>

        <button
          type="button"
          className="uppercase underline hover:text-purple-500 text-md font-serif mt-2"
        >
          subscribe
        </button>
      </div>
    </div>
  </div>
);

const Button = ({ children }: { children: React.ReactNode }) => (
  <button
    type="button"
    className="hover:text-purple-500 text-gray-600"
    onClick={() => window.scrollTo(0, 0)}
  >
    {children}
  </button>
);

export default Footer;
