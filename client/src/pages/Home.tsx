import React, { useEffect } from 'react';
import { Fade } from 'react-slideshow-image';
import home1 from '../images/home1.jpg';
import hesitating from '../images/hesitating.jpeg';
import 'react-slideshow-image/dist/styles.css';

const Home = () => {
  useEffect(() => {
    document.title = 'Wamazon';
  }, []);

  return (
    <div>
      <div className="bg-purple-300 w-full h-200">
        <Fade duration={3000} pauseOnHover={false} arrows={false}>
          <div className="slide-container flex">
            <div className="w-2/3">
              <p>Welcome</p>
            </div>
            <div>
              <img src={home1} alt="home1" className="h-200" />
            </div>
          </div>

          <div className="slide-container flex">
            <div className="w-2/3">
              <p>
                Hesitating on items to buy because of their high prices? Here
                you can buy at the best price and with free shipping !
              </p>
            </div>
            <div>
              <img src={hesitating} alt="hesitating" className="h-200" />
            </div>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Home;
