import React from 'react';

import styles from './Navbar.module.css';

function Navbar(props) {
  return (
    <div className={styles.Navbar}>
      <div className={styles.HomeContainer}>
        <div className={styles.Option} onClick={() => props.setCurrentPage('home')}>Home</div>
      </div>



      <div className={styles.LoginRegisterContainer}>
        {props.currentPage != 'login' && <div className={styles.Option} onClick={() => props.setCurrentPage('login')}>Log in</div>}
        {props.currentPage != 'register' && <div className={styles.Option} onClick={() => props.setCurrentPage('register')}>Register</div>}
      </div>
    </div>
  );
}

export default Navbar;
