import React, { useState } from 'react';
import { Fade } from 'react-slideshow-image';
import { Slide } from '@material-ui/core';
import { Link } from 'react-router-dom';
import home1 from '../images/home1.jpg';
import hesitating from '../images/hesitating.jpeg';
import 'react-slideshow-image/dist/styles.css';

const Home = () => {
  const [slide, setSlide] = useState<boolean[]>([true, false]);

  return (
    <div>
      <div className="bg-purple-200 w-full h-200">
        <Fade
          duration={4000}
          pauseOnHover={false}
          arrows={false}
          onChange={(oldIndex: number, newIndex: number) => {
            if (newIndex === 0) {
              setSlide([true, false]);
            } else {
              setSlide([false, true]);
            }
          }}
        >
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
              <img src={home1} alt="home1" className="h-200 w-200" />
            </div>
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
            <div>
              <img src={hesitating} alt="hesitating" className="h-200 w-200" />
            </div>
          </div>
        </Fade>
      </div>
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

export default Home;
