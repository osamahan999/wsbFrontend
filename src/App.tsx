import React, { useEffect, useState } from 'react';
import Navbar from './components/navbar/Navbar';

import styles from "./App.module.css";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AxiosError, AxiosResponse } from 'axios';

const axios = require('axios');

function App() {

  const [currentPage, setCurrentPage] = useState('home');

  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token != null) {

      axios.post("http://localhost:5000/user/loginWithToken", {
        token: token

      }).then((response: AxiosResponse) => {
        setCurrentUser(response.data[0]);
      }).catch((err: AxiosError) => {
        console.log(err);
      })
    }


  })

  return (
    <div className={styles.App}>
      <Navbar currentPage={currentPage} setCurrentPage={(e: string) => setCurrentPage(e)} />
      <div>
        {currentPage == "home" && <Home />}


        {currentPage == "login" && <Login setUser={(e: JSON) => setCurrentUser(e)} />}
        {currentPage == "register" && <Register />}
      </div>



    </div>
  );
}

export default App;
