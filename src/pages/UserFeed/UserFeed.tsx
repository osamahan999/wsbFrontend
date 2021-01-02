import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';

import styles from './UserFeed.module.css';


function UserFeed(props: any) {

    const [username, setUsername] = useState('');
    const [totalMoney, setTotalMoney] = useState(0);
    const [userId, setUserId] = useState(-1);

    useEffect(() => {
        setUsername(props.user.username);
        setTotalMoney(props.user.totalMoney);
        setUserId(props.user.userId);
    })


    return (

        <div className={styles.UserFeed}>

            <Sidefiller />

            <div className={styles.ContentContainer}>


            </div>
            <Sidefiller />


        </div>
    );
}

export default UserFeed;
