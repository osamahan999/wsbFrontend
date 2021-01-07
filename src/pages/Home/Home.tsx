import React from 'react';
import SidefillerLeft from '../../components/sidefiller/SidefillerLeft';
import SidefillerRight from '../../components/sidefiller/SidefillerRight';
import Carousel from 'react-elastic-carousel';

import styles from './Home.module.css';

import GTO from '../../assets/grandtheftoptions.png';
import deskImage from '../../assets/deskImage.webp';
import stonksgoup from '../../assets/stonksgoup.jpeg';

function Home() {
  return (
    <div className={styles.Home}>


      <SidefillerLeft />

      <div className={styles.Content}>

        <Carousel>
          <div className={styles.CarouselDiv}>
            <div>Welcome to <b>Wallstreet Bets Tycoon</b></div>
            <img className={styles.Image} src={GTO}></img>

          </div>

          <div className={styles.CarouselDiv}>
            <div>Why use Robinhood which crashes all the time when you can use this site?</div>
            <img className={styles.Image} src={deskImage}></img>

          </div>

          <div className={styles.CarouselDiv}>
            <div>This could be you!</div>
            <img className={styles.Image} src={stonksgoup}></img>

          </div>



        </Carousel>






      </div>

      <SidefillerRight />

    </div>
  );
}

export default Home;
