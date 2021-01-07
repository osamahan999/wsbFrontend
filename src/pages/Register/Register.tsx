import { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';

import SidefillerLeft from '../../components/sidefiller/SidefillerLeft';
import SidefillerRight from '../../components/sidefiller/SidefillerRight';


import styles from './Register.module.css';

const axios = require("axios");

function Register(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (username == '' || password == '') setMessage("Cannot have empty input");
        else {
            axios.post("http://localhost:5000/user/userRegister", {
                email: email,
                username: username,
                password: password

            }).then((response: AxiosResponse) => {
                setMessage(response.data);
            }).catch((err: AxiosError) => {
                if (err.response != null) setMessage(err.response.data);
            })
        }



    }

    return (

        <div className={styles.Register}>

            <SidefillerLeft />
            <div className={styles.ContentContainer}>
                <div>

                    <div className={styles.ResponseDiv}>{message}</div>

                    <div className={styles.RegisterInputsContainer}>
                        <div className={styles.InputBox}>
                            <p>Email:</p>
                            <input type="email" onChange={(e) => setEmail(e.target.value)}></input>
                        </div>
                        <div className={styles.InputBox}>
                            <p>Username:</p>
                            <input onChange={(e) => setUsername(e.target.value)}></input>
                        </div>
                        <div className={styles.InputBox}>
                            <p>Password:</p>
                            <input onChange={(e) => setPassword(e.target.value)}></input>
                        </div>

                        <button onClick={() => handleSubmit()} className={styles.RegisterButton}>Start losing money now!</button>



                    </div>

                </div>

            </div>
            <SidefillerRight />


        </div>
    );
}

export default Register;
