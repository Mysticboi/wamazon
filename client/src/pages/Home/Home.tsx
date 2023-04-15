import React, { useState, useEffect } from 'react';
import { Slide } from '@material-ui/core';
import { Link } from 'react-router-dom';
import DailyDeals from './DailyDeals';
import home1 from '../../images/home1.jpg';
import hesitating from '../../images/hesitating.jpeg';
import 'react-slideshow-image/dist/styles.css';
import icon1 from '../../images/home-icon-1.png';
import icon2 from '../../images/home-icon-2.png';
import icon3 from '../../images/home-icon-3.png';
import icon4 from '../../images/home-icon-4.png';

type InfoProps = {
  title: string;
  text: string;
  imgSrc: string;
};

const infos = [
  {
    title: 'Free Shipping',
    text: 'Free shipping on all orders',
    imgSrc: icon1,
  },
  {
    title: 'Support 24/7',
    text: 'You can call us anytime for technical support!',
    imgSrc: icon2,
  },
  {
    title: 'Money Return',
    text: ' Send back a product you have 10 days',
    imgSrc: icon3,
  },
  {
    title: 'Order Discount',
    text: 'Get discounts by buying multiple products',
    imgSrc: icon4,
  },
];

const Home = () => {
  const [slide, setSlide] = useState<boolean[]>([true, false]);

  useEffect(() => {
    document.title = 'Wamazon';
  }, []);

  return (
    <div>
      <div className="w-full h-200 bg-light-purple">
        <div className="slide-container flex">
          <div className="w-2/3">
            <Slide
              direction="up"
              in={slide[0]}
              mountOnEnter
              unmountOnExit
              timeout={1500}
            >
              <div className="flex justify-center items-center h-full font-sans">
                <div>
                  <p className="text-4xl mb-7 font-extrabold">Welcome!</p>
                  <p className="text-xl mb-8 mt-5">
                    Online shopping has never been easier.
                  </p>
                  <ShopNow />
                </div>
              </div>
            </Slide>
          </div>
          <div className="">
            <img
              src={home1}
              alt="home1"
              className="h-200 w-200"
              width={533}
              height={533}
            />
          </div>

          <div className="h-200 w-20" />
        </div>

        <div className="slide-container flex">
          <div className="w-2/3">
            <Slide
              direction="up"
              in={slide[1]}
              mountOnEnter
              unmountOnExit
              timeout={1500}
            >
              <div className="flex justify-center items-center h-full font-sans">
                <div>
                  <p className="text-4xl mb-7 font-extrabold">
                    We have the best prices.
                  </p>
                  <p className="text-xl">
                    Are you hesitating to buy items because of their high
                    prices?
                  </p>
                  <p className="text-xl">
                    Here you can buy products at the best price.
                  </p>
                  <p className="text-xl mt-5 mb-8">Our shipping is free!</p>
                  <ShopNow />
                </div>
              </div>
            </Slide>
          </div>

          <div className="h-200 w-20" />
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="mt-16 flex flex-wrap space-x-5 justify-center items-center">
          {infos.map((info) => (
            <Info {...info} key={info.title} />
          ))}
        </div>
      </div>

      <DailyDeals />
    </div>
  );
};

const ShopNow = () => (
  <Link to="shop">
    <div className="border-2 h-12 border-black p-8  w-40 m-auto flex justify-center items-center transition-colors duration-1000 hover:bg-purple-500 hover:border-purple-500 hover:text-white">
      SHOP NOW
    </div>
  </Link>
);

const Info = ({ title, text, imgSrc }: InfoProps) => (
  <div className="flex">
    <div className="w-20 h-24 hover:animate-wiggle">
      <img src={imgSrc} alt="" width={60} height={60} />
    </div>
    <div className="w-44">
      <p className="text-lg">{title}</p>
      <p className="text-gray-500">{text}</p>
    </div>
  </div>
);

export default Home;
