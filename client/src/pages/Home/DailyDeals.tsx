import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Rating } from '@material-ui/lab';
import { FavoriteBorder, Star } from '@material-ui/icons';
import flame from '../../images/flame.svg';
import { WishListContext } from '../../context/WishListContext';

interface Product {
  _id: string;
  productName: string;
  imgUrl: string;
  rating: number;
  price: number;
}

interface CardProps extends Product {
  currentPage: number;
}

const pages = ['Best sellers', 'Top rated', 'New arrivals'];
const apiPaths = [
  'product/topSellers',
  'product/topRated',
  'product/newArrivals',
];

const DailyDeals = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  console.log('products', products);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`/api/${apiPaths[currentPage]}`);

        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed fetch products');
      }
    };

    getProducts();
  }, [currentPage]);

  return (
    <div className="mt-10 mb-5">
      <div
        id="title"
        className="flex relative justify-center items-center space-x-3"
      >
        <div className="w-20 h-1 bg-black" />
        <p className="uppercase text-4xl ">Daily deals!</p>
        <div className="w-20 h-1 bg-black" />
      </div>

      <nav className="flex justify-center items-center text-xl space-x-8 mt-5 font-sans">
        {pages.map((page, index) => {
          const className =
            index === currentPage
              ? 'font-bold'
              : 'text-gray-500 hover:text-black ';

          const handleClick = () => {
            setCurrentPage(index);
          };
          return (
            <button
              type="button"
              key={page}
              className={className}
              onClick={handleClick}
            >
              {page}
            </button>
          );
        })}
      </nav>
      <div className="flex justify-center items-center w-full">
        <ProductsList products={products} currentPage={currentPage} />
      </div>
    </div>
  );
};

const ProductsList = ({
  products,
  currentPage,
}: {
  products: Product[];
  currentPage: number;
}) => (
  <div className="flex flex-wrap justify-center items-center space-x-10 mt-8 w-2/3">
    {products.map((product) => (
      <ProductCard {...product} key={product._id} currentPage={currentPage} />
    ))}
  </div>
);

const ProductCard = ({
  _id,
  productName,
  imgUrl,
  rating,
  price,
  currentPage,
}: CardProps) => {
  const { addToWishList } = useContext(WishListContext);

  const handleClick = () => {
    addToWishList(_id);
  };

  return (
    <div className="flex-none">
      <div className="h-80 flex justify-center items-center relative">
        {currentPage === 0 && (
          <div className="absolute top-6 right-5">
            <img alt="" src={flame} width={30} />
          </div>
        )}

        {currentPage === 1 && (
          <div className="absolute top-6 right-5">
            <Star style={{ color: 'orange' }} fontSize="large" />
          </div>
        )}

        {currentPage === 2 && (
          <div className="absolute top-9 right-5 bg-nice-purple rounded text-white pl-2 pr-2 font-sans">
            New
          </div>
        )}

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
          <div className="text-white hover:bg-black border border-gray-400 w-full flex justify-center items-center">
            <Link to={`/product/${_id}`} className="text-lg">
              View Item
            </Link>
          </div>
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

export default DailyDeals;
