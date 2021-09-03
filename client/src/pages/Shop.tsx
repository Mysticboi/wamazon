import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import categories from '../data/categories.json';

const Shop = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    document.title = 'Shop';
  });
  return (
    <div>
      <div className="text-center text-2xl bg-gray-100 h-20 flex justify-center items-center">
        <p>Welcome to the Shop</p>
      </div>

      <div className="flex w-full">
        <div className="bg-gray-200 w-1/4">
          <div className="ml-5">
            <p className="text-xl">Search</p>
            <div className="border-2 border-gray-600 p-2 w-2/3 mt-5">
              <TextField
                placeholder="Search here..."
                fullWidth
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <div className="text-4xl text-gray-500 absolute bottom-1 right-10">
                        |
                      </div>
                      <IconButton aria-label="search">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div id="categories" className="ml-10">
            <p className="text-xl mt-10 mb-3">Categories</p>
            <div className="text-xs">
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <FormControlLabel
                    value=""
                    control={<Radio color="primary" />}
                    label="All categories"
                  />

                  {categories.map((category) => (
                    <FormControlLabel
                      value={category}
                      control={<Radio color="primary" />}
                      label={category}
                      key={category}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="bg-gray-400 w-3/4">Showing items here</div>
      </div>
    </div>
  );
};

export default Shop;
