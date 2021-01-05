import React, { useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar';

import styles from "./App.module.css";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AxiosError, AxiosResponse } from 'axios';
import UserFeed from './pages/UserFeed/UserFeed';
import Stock from './pages/Stock/Stock';

const axios = require('axios');

function App() {

  const [currentPage, setCurrentPage] = useState('home');

  const [currentUser, setCurrentUser] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentStockInFocus, setCurrentStockInFocus] = useState<string>();

  useEffect(() => {

    let token = getToken();


    if (token != 'fail') {
      axios.post("http://localhost:5000/user/loginWithToken", {
        token: token

      }).then((response: AxiosResponse) => {
        setCurrentUser(response.data[0]);
        setCurrentPage('userfeed');
        setIsLoggedIn(true);

      }).catch((err: AxiosError) => {
        alert(err);
      })
    }



  }, [])

  useEffect(() => {
    if (JSON.stringify(currentUser) == '{}') {
      setCurrentPage('home')
      setIsLoggedIn(false);
    } else {
      setCurrentPage('userfeed');
      setIsLoggedIn(true);
    }

  }, [currentUser])


  /**
   * Returns the token from the cookies
   * or fail if no cookie with token
   */
  const getToken = () => {

    let cookies = document.cookie.split(';');
    let ret = '';

    if (cookies[0] != "") {
      cookies.forEach((keyPair) => {
        let subArray: Array<string> = keyPair.split('=');
        let key: string = subArray[0].trim();
        let value: string = subArray[1].trim();

        if (key == "token") ret = value;
      })
    } else return 'fail';

    return ret;
  }


  const logout = () => {
    let token = getToken();

    axios.post("http://localhost:5000/user/logout", {
      token: token

    }).then((response: AxiosResponse) => {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      setCurrentUser({});
      setIsLoggedIn(false);
      setCurrentPage('home');

    }).catch((err: AxiosError) => {
      alert(err.response);
    })
  }

  return (
    <div className={styles.App}>
      <Navbar isLoggedIn={isLoggedIn} logOut={() => logout()} currentPage={currentPage} setCurrentPage={(e: string) => setCurrentPage(e)} />
      <div>
        {currentPage == "home" && <Home />}


        {currentPage == "login" && <Login setUser={(e: JSON) => setCurrentUser(e)} />}
        {currentPage == "register" && <Register />}

        {currentPage == "userfeed" &&
          <UserFeed
            user={currentUser}
            setCurrentStock={(e: string) => setCurrentStockInFocus(e)}
            setCurrentPage={(e: string) => setCurrentPage(e)}
          />}
        {currentPage == "stock" && <Stock stock={currentStockInFocus} />}

      </div>



    </div>
  );
}

export default App;
