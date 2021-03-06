import { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';

import SidefillerLeft from '../../components/sidefiller/SidefillerLeft';
import SidefillerRight from '../../components/sidefiller/SidefillerRight';

import styles from './Login.module.css';

const axios = require("axios");

function Login(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = () => {
        if (username == '' || password == '') setMessage("Cannot have empty input");
        else {

            //tell client loading 
            setIsLoading(true);


            axios.post("https://wallstreet-bets-tycoon-backend.uc.r.appspot.com/user/loginWithoutToken", {
                username: username,
                password: password

            }).then((response: AxiosResponse) => {
                setMessage("Success");


                let now = new Date();
                now.setTime(now.getTime() + (1000 * 3600000)); //lasts 3.6 million seconds

                let cookie = "token = " + response.data.token + "; SameSite=None; Secure; expires=" + now.toUTCString();
                document.cookie = cookie;
                props.setUser(response.data);

                setIsLoading(false);

                //add token and shit to localstorage
            }).catch((err: AxiosError) => {
                if (err.response != null) setMessage(err.response.data.message);
                setIsLoading(false);


            })
        }



    }


    /**
     * If isLoading ->
     *  return (<div> big ass cock</div>)
     */

    //uhh do i put it here?

    if (isLoading) {
        return (<div>Logging you In</div>);
    }



    return (

        <div className={styles.Login}>

            <SidefillerLeft />
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
            <SidefillerRight />


        </div>
    );
}

export default Login;
