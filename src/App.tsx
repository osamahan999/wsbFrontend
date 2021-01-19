import React, { useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar';

import styles from "./App.module.css";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AxiosError, AxiosResponse } from 'axios';
import UserFeed from './pages/UserFeed/UserFeed';
import Stock from './pages/Stock/Stock';
import Profile from './pages/Profile/Profile';

const cookieToken = require('./helper');

const axios = require('axios');

function App() {

  const [currentPage, setCurrentPage] = useState('home');

  const [currentUser, setCurrentUser] = useState<JSON | any>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //for when logging out 
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentStockInFocus, setCurrentStockInFocus] = useState<string>();

  useEffect(() => {

    let token = cookieToken.getToken();

    if (token != 'fail') {
      setIsLoading(true);

      logIn(token);

    }
  }, [])


  const logIn = (token: string) => {

    axios.post("https://wallstreet-bets-tycoon-backend.uc.r.appspot.com/user/loginWithToken", {
      token: token

    }).then((response: AxiosResponse) => {
      setCurrentUser(response.data[0]);
      setCurrentPage('userfeed');
      setIsLoggedIn(true);

      setIsLoading(false);

    }).catch((err: AxiosError) => {
      alert(err);
      setIsLoading(false);

    })
  }

  /**
   * Just like logIn, except does no updates except to currentUser
   * @param token 
   */
  const updateNavbar = (token: string) => {
    axios.post("https://wallstreet-bets-tycoon-backend.uc.r.appspot.com/user/loginWithToken", {
      token: token

    }).then((response: AxiosResponse) => {
      setCurrentUser(response.data[0]);

    }).catch((err: AxiosError) => {
      if (err.response != undefined) alert(err.response.data.message);

    })
  }

  //can be deleted now?
  useEffect(() => {


    if (JSON.stringify(currentUser) == '{}') {
      setCurrentPage('home')
      setIsLoggedIn(false);

    } else if (currentPage == 'stock') {
      setIsLoggedIn(true);

    } else {
      setCurrentPage('userfeed');
      setIsLoggedIn(true);
    }


  }, [currentUser])





  const logout = () => {
    let token = cookieToken.getToken();

    setIsLoading(true);

    axios.post("https://wallstreet-bets-tycoon-backend.uc.r.appspot.com/user/logout", {
      token: token

    }).then((response: AxiosResponse) => {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      setCurrentUser({});
      setIsLoggedIn(false);
      setCurrentPage('home');
      setIsLoading(false);

    }).catch((err: AxiosError) => {
      if (err.response != undefined) alert(err.response.data.message);
      setIsLoading(false);

    })
  }

  if (isLoading) return (<div className={styles.LoadingDiv}>Loading</div>);

  return (
    <div className={styles.App}>
      <Navbar isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        logOut={() => logout()}
        currentPage={currentPage}
        setCurrentPage={(e: string) => setCurrentPage(e)}
      />
      <div>
        {currentPage == "home" && <Home />}


        {currentPage == "login" && <Login setUser={(e: JSON) => setCurrentUser(e)} />}
        {currentPage == "register" && <Register />}

        {currentPage == "userfeed" &&
          <UserFeed
            user={currentUser}
            setCurrentStock={(e: string) => setCurrentStockInFocus(e)}
            setCurrentPage={(e: string) => setCurrentPage(e)}
            updateNavbar={() => updateNavbar(cookieToken.getToken())}
          />}

        {currentPage == "stock" &&
          <Stock stock={currentStockInFocus}
            updateNavbar={() => updateNavbar(cookieToken.getToken())}
            currentUser={currentUser}
          />}

        {currentPage == "profile" &&
          <Profile
            currentUser={currentUser}
          />}

      </div>



    </div>
  );
}


export default App;
