import { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';

import styles from './Login.module.css';

const axios = require("axios");

function Login(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (username == '' || password == '') setMessage("Cannot have empty input");
        else {
            axios.post("http://localhost:5000/user/loginWithoutToken", {
                username: username,
                password: password

            }).then((response: AxiosResponse) => {
                setMessage("Success");

                localStorage.setItem('token', response.data.token);
                props.setUser(response.data);
                console.log(response);

                //add token and shit to localstorage
            }).catch((err: AxiosError) => {
                if (err.response != null) setMessage(err.response.data);
            })
        }



    }

    return (

        <div className={styles.Login}>

            <Sidefiller />
            <div className={styles.ContentContainer}>
                <div>

                    <div className={styles.ResponseDiv}>{message}</div>
                    {/* Username, password */}
                    <div className={styles.LoginInputsContainer}>
                        <div className={styles.InputBox}>
                            <p>Username:</p>
                            <input onChange={(e) => setUsername(e.target.value)}></input>
                        </div>
                        <div className={styles.InputBox}>
                            <p>Password:</p>
                            <input onChange={(e) => setPassword(e.target.value)}></input>
                        </div>

                        <button onClick={() => handleSubmit()} className={styles.LoginButton}>$$$$$</button>



                    </div>

                </div>

            </div>
            <Sidefiller />


        </div>
    );
}

export default Login;
