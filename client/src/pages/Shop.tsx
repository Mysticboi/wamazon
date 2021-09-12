import React, { useState, useEffect, useContext } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  CircularProgress,
} from '@material-ui/core';
import { Search, FavoriteBorder } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Rating, Pagination } from '@material-ui/lab';
import Select from 'react-select';
import categories from '../data/categories.json';
import { WishListContext } from '../context/WishListContext';

interface Product {
  _id: string;
  productName: string;
  imgUrl: string;
  rating: number;
  price: number;
}

type Filter = {
  label: string;
  value: string;
};

const filterOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Price - High to Low', value: 'priceHighToLow' },
  { label: 'Price - Low to High', value: 'priceLowToHigh' },
];

const Shop = () => {
  useEffect(() => {
    document.title = 'Shop';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState<Filter | null>(filterOptions[0]);
  const [loading, setLoading] = useState(true);

  // Number of products per page
  const limit = 4;

  useEffect(() => {
    getProducts();
  }, [page, filter, category]);

  // Sets page to 1 when we change filter or category , so we don't stay on previous page
  useEffect(() => {
    setPage(1);
  }, [filter, category]);

  const getProducts = async (search = '') => {
    try {
      const response = await axios.get('/api/product/shop', {
        params: { page, limit, filter: filter?.value, category, search },
      });

      const { products, totalPages } = response.data;
      setProducts(products);
      setTotalPages(totalPages);
      setLoading(false);
    } catch (e) {
      console.error('Failed fetch products');
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <div>
      <div className="text-center text-2xl bg-gray-100 h-20 flex justify-center items-center">
        <p>Welcome to the Shop</p>
      </div>

      <div className="flex w-full mt-10">
        <div className="w-1/4">
          <div className="ml-10">
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
                      <IconButton
                        aria-label="search"
                        onClick={() => getProducts(search)}
                      >
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

        {loading ? (
          <div className="h-96 flex justify-center items-center w-full">
            <CircularProgress color="primary" size={70} />
          </div>
        ) : (
          <div className="w-3/4">
            <div className="w-48 text-sm font-sans mt-3 ml-3">
              <Select
                options={filterOptions}
                isSearchable={false}
                value={filter}
                onChange={(value) => setFilter(value)}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: '#A548FC',
                    primary: 'black',
                  },
                })}
              />
            </div>

            {products.length > 0 ? (
              <div>
                <div className="flex flex-wrap justify-center items-center space-x-20 mt-8">
                  {products.map((product) => (
                    <ProductCard {...product} key={product._id} />
                  ))}
                </div>

                <div className="flex justify-center items-center w-full mt-7">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    disabled={totalPages === 1}
                  />
                </div>
              </div>
            ) : (
              <div className="text-3xl flex justify-center items-center h-96">
                <div className="border-4 border-purple-500 p-5">
                  No products yet. Coming soon...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ _id, productName, imgUrl, rating, price }: Product) => {
  const { addToWishList } = useContext(WishListContext);
  const handleClick = () => {
    addToWishList(_id);
  };

  return (
    <div className="flex-none">
      <div className="h-80 flex justify-center items-center relative">
        <Link to={`/product/${_id}`}>
          <img alt="" src={imgUrl} width={200} height={200} />
        </Link>
        <div className="absolute bottom-5 bg-nice-purple w-48 h-10 flex">
          <button
            className="border border-gray-400 flex justify-center items-center  hover:bg-black"
            title="Add to Wishlist"
            type="button"
            onClick={handleClick}
          >
            <FavoriteBorder style={{ color: 'white' }} />
          </button>
          <Link
            to={`/product/${_id}`}
            className="text-lg h-full  text-white hover:bg-black border border-gray-400 w-full flex justify-center items-center"
          >
            View Item
          </Link>
        </div>
      </div>
      <div className="text-center w-60">
        <Link to={`/product/${_id}`} className="hover:text-purple-500  text-xl">
          <p className="font-sans">{productName}</p>
        </Link>

        <Rating
          value={typeof rating === 'string' ? parseFloat(rating) : rating}
          readOnly
          precision={0.5}
        />

        <p className="font-sans font-semibold text-lg">{price.toFixed(2)}€</p>
      </div>
    </div>
  );
};

export default Shop;
