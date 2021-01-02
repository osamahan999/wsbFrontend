import React from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';

import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.Home}>


      <Sidefiller />

      <div className={styles.Content}>

        WallstreetBets Tycoon
      </div>

      <Sidefiller />

    </div>
  );
}

export default Home;
