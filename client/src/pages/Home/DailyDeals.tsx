import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Rating } from '@material-ui/lab';
import { FavoriteBorder } from '@material-ui/icons';

interface Product {
  _id: string;
  productName: string;
  imgUrl: string;
  rating: number;
  price: number;
}

interface CardProps extends Product {
  isNew?: boolean;
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

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/${apiPaths[currentPage]}`
        );

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
        <ProductsList products={products} />
      </div>
    </div>
  );
};

const ProductsList = ({ products }: { products: Product[] }) => (
  <div className="flex flex-wrap justify-center items-center space-x-10 mt-8 w-2/3">
    {products.map((product) => (
      <ProductCard {...product} key={product._id} />
    ))}
  </div>
);

const ProductCard = ({
  _id,
  productName,
  imgUrl,
  rating,
  price,
  isNew,
}: CardProps) => {
  const handleClick = () => {
    // TODO Add item to wishList using it's _id
  };

  return (
    <div className="flex-none">
      <div className="h-80 flex justify-center items-center relative">
        <Link to={`/product/${_id}`}>
          <img alt="" src={imgUrl} width={200} height={200} />
        </Link>
        <div className="absolute bottom-5 bg-purple-600 w-48 h-10 flex">
          <button
            className="border border-gray-400 flex justify-center items-center hover:bg-black"
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
          value={typeof rating === 'string' ? parseInt(rating, 10) : rating}
          readOnly
          precision={0.5}
        />

        <p className="font-sans font-semibold text-lg">{price.toFixed(2)}€</p>
      </div>
    </div>
  );
};

export default DailyDeals;
