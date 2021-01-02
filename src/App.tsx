import React, { useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar';

import styles from "./App.module.css";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AxiosError, AxiosResponse } from 'axios';
import UserFeed from './pages/UserFeed/UserFeed';

const axios = require('axios');

function App() {

  const [currentPage, setCurrentPage] = useState('userfeed');

  const [currentUser, setCurrentUser] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    let token = getToken();


    if (token != 'fail') {
      axios.post("http://localhost:5000/user/loginWithToken", {
        token: token

      }).then((response: AxiosResponse) => {
        setCurrentUser(response.data[0]);
        setCurrentPage('userfeed');
        setIsLoggedIn(true);
        console.log(currentUser);
      }).catch((err: AxiosError) => {
        console.log(err);
      })
    }



  }, [])


  /**
   * Returns the token from the cookies
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

  return (
    <div className={styles.App}>
      <Navbar isLoggedIn={isLoggedIn} currentPage={currentPage} setCurrentPage={(e: string) => setCurrentPage(e)} />
      <div>
        {currentPage == "home" && <Home />}


        {currentPage == "login" && <Login setUser={(e: JSON) => setCurrentUser(e)} />}
        {currentPage == "register" && <Register />}

        {currentPage == "userfeed" && <UserFeed user={currentUser} />}
      </div>



    </div>
  );
}

export default App;
