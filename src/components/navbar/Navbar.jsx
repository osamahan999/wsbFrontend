import React from 'react';

import styles from './Navbar.module.css';
import logo from '../../assets/logo.jpeg';


function Navbar(props) {



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


      {props.isLoggedIn &&
        <div className={styles.UserData}>
          <p className={styles.Data}>Username: {props.currentUser.username}</p>
          <p className={styles.Data}>Your tendie funds: ${props.currentUser.total_money}</p>

        </div>
      }

      {!props.isLoggedIn ?
        <div className={styles.LoginRegisterContainer}>
          <div className={styles.OptionContainer}>
            {props.currentPage != 'login' &&
              <div className={styles.Option} onClick={() => props.setCurrentPage('login')}>Log in</div>
            }
          </div>

          <div className={styles.OptionContainer}>
            {props.currentPage != 'register' && <div className={styles.Option} onClick={() => props.setCurrentPage('register')}>Register</div>
            }
          </div>
        </div>
        :
        <div className={styles.LoginRegisterContainer}>

          <div className={styles.Option}>Profile</div>
          <div className={styles.Option} onClick={() => {
            props.logOut();
            props.setCurrentPage('home');
          }}>Logout</div>
        </div>
      }

    </div>
  );
}

export default Navbar;
