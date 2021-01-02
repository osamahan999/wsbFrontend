import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';

import styles from './UserFeed.module.css';


function UserFeed(props: any) {

    const [username, setUsername] = useState('');
    const [totalMoney, setTotalMoney] = useState(0);
    const [userId, setUserId] = useState(-1);

    const [searchInput, setSearchInput] = useState('');


    useEffect(() => {
        setUsername(props.user.username);
        setTotalMoney(props.user.total_money);
        setUserId(props.user.user_id);
    }, [])


    return (

        <div className={styles.UserFeed}>

            <Sidefiller />

            <div className={styles.ContentContainer}>
                {/* search bar */}
                <div className={styles.SearchbarContainer}>

                    <div className={styles.searchCaption}>Search</div>
                    <input onChange={(e) => {
                        setSearchInput(e.target.value);
                        // append outputs to bottom

                    }} className={styles.Searchbar}></input>
                    <button onClick={() => {
                        alert('consider urself yolod');
                    }}>find yolo</button>
                </div>
            </div>
            <Sidefiller />


        </div>
    );
}

export default UserFeed;
