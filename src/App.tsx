import React from 'react';
import { useState } from 'react';
import Navbar from './components/navbar/Navbar';

import styles from "./App.module.css";


function App() {
  const [currentPage, setCurrentPage] = useState('');
  return (
    <div className={styles.App}>
      <Navbar currentPage={currentPage} setCurrentPage={(e: string) => setCurrentPage(e)} />

      {currentPage == "login" && <div>login</div>}
      {currentPage == "register" && <div>register</div>}


    </div>
  );
}

export default App;
