import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';


import styles from './Stock.module.css';

const axios = require('axios');


function Stock(props: any) {

    const [currentStock, setCurrentStock] = useState<JSON | any>();
    const [optionExpirations, setOptionExpirations] = useState<Array<string>>([]);
    const [pulledOptions, setPulledOptions] = useState<Array<JSON>>([]);
    const [optionInView, setOptionInView] = useState<JSON | any>();

    useEffect(() => {
        axios.get("http://localhost:5000/stockData/getStockQuote", {
            params: {
                'symbol': props.stock
            }
        }).then((response: AxiosResponse) => {
            setCurrentStock(response.data);
        }).catch((err: AxiosError) => {
            console.log(err);

        })
    }, [])


    useEffect(() => {
        axios.get("http://localhost:5000/stockData/getExpirations", {
            params: {
                'symbol': props.stock
            }
        }).then((response: AxiosResponse) => {
            setOptionExpirations(response.data);

        }).catch((err: AxiosError) => {
            setOptionExpirations([]);

        })
    }, [currentStock])

    const getOptions = (symbol: string, date: string) => {
        axios.get("http://localhost:5000/stockData/getOptionsOnDate", {
            params: {
                'symbol': symbol,
                'expiration': date,
                'optionType': 'call'
            }
        }).then((response: AxiosResponse) => {
            setPulledOptions(response.data);

        }).catch((err: AxiosError) => {
            setPulledOptions([]);

        })
    }


    return (

        <div className={styles.Stock}>

            <Sidefiller />


            <div className={styles.ContentContainer}>
                {currentStock != undefined &&
                    <div className={styles.container}>
                        <div className={styles.StockData}>
                            <h1>{currentStock.description}</h1>
                            <h1>open: ${currentStock.open}</h1>
                            <h1>close: ${currentStock.close}</h1>
                            <h1>volume: {currentStock.volume}</h1>
                            <h1>Current Cost: ${currentStock.last}</h1>

                            <br></br>
                        </div>

                        <h1>Options</h1>

                        <div className={styles.OptionsContainer}>

                            <select >
                                {(optionExpirations != undefined && optionExpirations.length != 0) ? <option>Select an option</option> : <option>No options For {props.stock}</option>}

                                {(optionExpirations != undefined && optionExpirations.length != 0) &&
                                    optionExpirations.map((date) => {
                                        return (
                                            <option className={styles.Option}
                                                onClick={() => getOptions(props.stock, date)}>
                                                {date}</option>
                                        );
                                    })}
                            </select>


                        </div>

                        <div className={styles.PulledOptions}>
                            <div className={styles.DescriptionContainer}>
                                {(pulledOptions != undefined || pulledOptions != []) && pulledOptions.map((option: any) => {
                                    return (<p onClick={() => setOptionInView(option)} className={styles.Option}>{option.description + " at $" + option.last}</p>)
                                })}

                            </div>
                            {optionInView != undefined &&
                                <div className={styles.OptionDetailsContainer}>
                                    <h2>Option Details</h2>
                                    <p>{optionInView.description}</p>

                                    <p>Volume: {optionInView.volume}</p>
                                    <p>Ask ($): {optionInView.ask}</p>

                                    <p>Contract Size: {optionInView.contract_size}</p>
                                    <p>Low : ${optionInView.low} -- $High: {optionInView.high} </p>

                                    <div>
                                        <h2>Greeks</h2>
                                        {true &&
                                            <div className={styles.GreeksContainer}>
                                                {Object.keys(optionInView.greeks).map((key) => {
                                                    return (<p>{key + ": " + optionInView.greeks[key]}</p>)
                                                })}
                                            </div>

                                        }

                                    </div>

                                </div>

                            }
                        </div>
                    </div>
                }








            </div>
            <Sidefiller />


        </div>
    );
}

export default Stock;
