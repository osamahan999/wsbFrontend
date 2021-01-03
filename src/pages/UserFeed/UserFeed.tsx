import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';

import Autocomplete from '@material-ui/lab/Autocomplete';

import styles from './UserFeed.module.css';
import { TextField } from '@material-ui/core';

const axios = require('axios');
const api = require('../../config');


function UserFeed(props: any) {

    const [username, setUsername] = useState('');
    const [totalMoney, setTotalMoney] = useState(0);
    const [userId, setUserId] = useState(-1);

    const [searchInput, setSearchInput] = useState('');
    const [stocksInDropdown, setStocksInDropdown] = useState<any[]>([]);

    useEffect(() => {
        setUsername(props.user.username);
        setTotalMoney(props.user.total_money);
        setUserId(props.user.user_id);

    }, [])


    useEffect(() => {

        if (searchInput.length > 0) {

            axios.get("https://sandbox.tradier.com/v1/markets/search", {
                params: {
                    'q': searchInput,
                    'indexes': false
                },
                headers: {
                    'Authorization': 'Bearer ' + api.getToken(),
                    'Accept': 'application/json'
                }
            }).then((response: AxiosResponse) => {
                let responseStocks = (response.data.securities.security);
                let i = responseStocks.length;
                i > 4 ? setStocksInDropdown(responseStocks.slice(0, 4)) : setStocksInDropdown(responseStocks);

            }).catch((err: AxiosError) => {
                setStocksInDropdown([]);

            })
        } else {
            setStocksInDropdown([]);
        }

    }, [searchInput])




    return (

        <div className={styles.UserFeed}>

            <Sidefiller />


            <div className={styles.ContentContainer}>
                {/* search bar */}
                <div className={styles.SearchbarContainer}>

                    <div className={styles.searchCaption}>Search</div>

                    <Autocomplete
                        id="combo-box-demo"
                        autoComplete={true}
                        clearOnBlur={false}
                        options={stocksInDropdown}
                        filterOptions={(options, state) => options}
                        freeSolo={true}
                        getOptionLabel={(option) => option.symbol}
                        style={{ width: 300 }}
                        renderInput={(params) =>
                            <TextField {...params}
                                label="Search Stocks"
                                onChange={(e) => { setSearchInput(e.target.value); }}
                                variant="outlined"
                            />
                        }

                        onChange={(event, value) => {
                            console.log(value);
                        }}

                    />


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
