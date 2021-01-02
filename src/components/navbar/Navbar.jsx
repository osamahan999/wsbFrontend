import React from 'react';

import styles from './Navbar.module.css';
import logo from '../../assets/logo.jpeg';


function Navbar(props) {
  return (
    <div className={styles.Navbar}>
      <div className={styles.HomeContainer}>

        <img src={logo} className={styles.Logo} onClick={() => props.setCurrentPage('home')}></img>
      </div>



      <div className={styles.LoginRegisterContainer}>
        <div className={styles.OptionContainer}>{props.currentPage != 'login' && <div className={styles.Option} onClick={() => props.setCurrentPage('login')}>Log in</div>}</div>
        <div className={styles.OptionContainer}>{props.currentPage != 'register' && <div className={styles.Option} onClick={() => props.setCurrentPage('register')}>Register</div>}</div>
      </div>
    </div>
  );
}

export default Navbar;
