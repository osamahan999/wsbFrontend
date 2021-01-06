import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';

import Autocomplete from '@material-ui/lab/Autocomplete';

import styles from './UserFeed.module.css';
import { TextField } from '@material-ui/core';

const axios = require('axios');


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

            axios.get("http://localhost:5000/stockData/searchBySymbol", {
                params: {
                    'input': searchInput
                }
            }).then((response: AxiosResponse) => {
                (response.data.length == undefined || response.data.length == 0) ? setStocksInDropdown([]) : setStocksInDropdown(response.data);
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
                                label="Search by Ticker"
                                onChange={(e) => { setSearchInput(e.target.value); }}
                                variant="outlined"
                            />
                        }

                        onChange={(event, value) => {
                            props.setCurrentStock(value.symbol);
                        }}


                    />


                    <button onClick={() => {


                        props.setCurrentPage('stock');

                    }}>find yolo</button>


                </div>
            </div>
            <Sidefiller />


        </div>
    );
}

export default UserFeed;
