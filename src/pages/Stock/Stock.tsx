import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';


import styles from './Stock.module.css';

const axios = require('axios');
const api = require('../../config');


function Stock(props: any) {

    const [currentStock, setCurrentStock] = useState<JSON | any>();
    const [currentStockOptions, setCurrentStockOptions] = useState<Array<JSON>>([]);

    useEffect(() => {
        axios.get("https://sandbox.tradier.com/v1/markets/quotes", {
            params: {
                'symbols': props.stock,
                'greeks': true
            },
            headers: {
                'Authorization': 'Bearer ' + api.getToken(),
                'Accept': 'application/json'
            }
        }).then((response: AxiosResponse) => {
            setCurrentStock(response.data.quotes.quote);
            console.log(response.data.quotes.quote);



        }).catch((err: AxiosError) => {
            console.log(err);

        })
    }, [])


    useEffect(() => {
        axios.get("https://sandbox.tradier.com/v1/markets/options/chains", {
            params: {
                'symbol': props.stock,
                'expiration': "2021-01-08",
                'greeks': true
            },
            headers: {
                'Authorization': 'Bearer ' + api.getToken(),
                'Accept': 'application/json'
            }
        }).then((response: AxiosResponse) => {
            setCurrentStockOptions(response.data);
            console.log(response);



        }).catch((err: AxiosError) => {
            console.log(err);

        })
    }, [currentStock])



    return (

        <div className={styles.Stock}>

            <Sidefiller />


            <div className={styles.ContentContainer}>
                {currentStock != undefined &&
                    <div>
                        <h1>{currentStock.description}</h1>
                        <h1>open: ${currentStock.open}</h1>
                        <h1>close: ${currentStock.close}</h1>
                        <h1>volume: {currentStock.volume}</h1>
                        <h1>Current Cost: ${currentStock.last}</h1>


                    </div>
                }








            </div>
            <Sidefiller />


        </div>
    );
}

export default Stock;
