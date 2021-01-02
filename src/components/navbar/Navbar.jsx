import React from 'react';

import styles from './Navbar.module.css';
import logo from '../../assets/logo.jpeg';


function Navbar(props) {

  const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }

  return (
    <div className={styles.Navbar}>
      <div className={styles.HomeContainer}>

        <img src={logo} className={styles.Logo} onClick={() => {
          if (props.isLoggedIn)
            props.setCurrentPage('userfeed');
          else
            props.setCurrentPage('home');
        }}></img>
      </div>


      {!props.isLoggedIn ?
        <div className={styles.LoginRegisterContainer}>
          <div className={styles.OptionContainer}>{props.currentPage != 'login' && <div className={styles.Option} onClick={() => props.setCurrentPage('login')}>Log in</div>}</div>
          <div className={styles.OptionContainer}>{props.currentPage != 'register' && <div className={styles.Option} onClick={() => props.setCurrentPage('register')}>Register</div>}</div>
        </div>
        :
        <div className={styles.LoginRegisterContainer}>
          <div className={styles.Option}>Profile</div>
          <div className={styles.Option} onClick={() => {
            logout();
            props.setCurrentPage('home');
          }}>Logout</div>
        </div>
      }

    </div>
  );
}

export default Navbar;
