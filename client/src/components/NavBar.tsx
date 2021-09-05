import React, { useState } from 'react';
import { ShoppingCartOutlined, KeyboardArrowDown } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { Paper, Collapse, Divider } from '@material-ui/core';

type NavItemProps = {
  name: string;
  link: string;
  paperContent?: React.ReactElement;
};

const NavBar = () => (
  <div>
    <nav className="justify-center flex invisible sm:visible">
      <div className="flex space-x-5">
        <NavItem
          name="Shop"
          link="/shop"
          paperContent={
            <div className="w-40">
              <p>Shop where you can buy a wide variety of items like: </p>
              <li className="ml-5">Clothes</li>
              <li className="ml-5">Furniture</li>
              <li className="ml-5">Electronics...</li>
            </div>
          }
        />
        <NavItem
          name="Marketplace"
          link="/marketplace"
          paperContent={
            <div className="w-40">
              Marketplace where you can sell your items
            </div>
          }
        />
        <Link to="/contact">
          <div className="hover:text-purple-500 text-lg">Contact Us</div>
        </Link>
      </div>
    </nav>

    <Cart />
    <div className="mt-3">
      {' '}
      <Divider />
    </div>
  </div>
);

const NavItem = ({ name, link, paperContent }: NavItemProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      onMouseEnter={() => setChecked(true)}
      onMouseLeave={() => setChecked(false)}
    >
      <div className="hover:text-purple-500 text-lg">
        <Link to={link}>
          {name}
          <KeyboardArrowDown />
        </Link>
      </div>

      <Collapse in={checked} className="absolute ml-2 top-22 z-10">
        <Paper elevation={1}>{paperContent}</Paper>
      </Collapse>
    </div>
  );
};

const Cart = () => {
  const items: number[] = [5, 15];
  const [checked, setChecked] = useState(false);
  return (
    <div className="absolute top-14 right-2 flex space-x-3 z-10">
      <div className="relative w-14">
        <button
          type="button"
          className="hover:text-purple-500"
          onClick={() => setChecked((prev) => !prev)}
        >
          <ShoppingCartOutlined style={{ fontSize: 40 }} />
          <span className="absolute top-0 right-1.5 rounded-full w-5 h-5 flex items-center justify-center bg-black text-white font-sans">
            {items.length}
          </span>
        </button>

        <Collapse in={checked} className="absolute top-22 right-10">
          <Paper elevation={1}>
            {items.length === 0 ? (
              <div className="w-72 h-10 flex justify-center items-center z-10">
                No items added to cart
              </div>
            ) : (
              <div className="w-85 z-10">
                <div className="w-3/4 flex mt-5 mb-5">
                  <span className="ml-10">
                    Total <b>:</b>
                  </span>
                  <span className="font-sans right-10 absolute">
                    {items.reduce((acc, x) => acc + x, 0).toFixed(2)}€
                  </span>
                </div>

                <Link to="/cart">
                  <div className="border-2 h-12 border-black w-3/4 m-auto flex justify-center items-center transition-colors duration-1000 hover:bg-purple-500 hover:border-purple-500 hover:text-white">
                    VIEW CART
                  </div>
                </Link>

                <div className="h-5" />
                <Link to="/checkout">
                  <div className="border-2 h-12 border-black w-3/4 m-auto flex justify-center items-center transition-colors duration-1000 hover:bg-purple-500 hover:border-purple-500 hover:text-white">
                    CHECKOUT
                  </div>
                </Link>
                <div className="h-4" />
              </div>
            )}
          </Paper>
        </Collapse>
      </div>
    </div>
  );
};

export default NavBar;
