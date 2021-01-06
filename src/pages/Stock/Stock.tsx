import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';


import styles from './Stock.module.css';

const axios = require('axios');
const cookieToken = require('../../helper');


function Stock(props: any) {

    const [currentStock, setCurrentStock] = useState<JSON | any>();

    const [userPw, setUserPw] = useState<string>('');
    const [amtStocksToPurchase, setAmtStocksToPurchase] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

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

    const purchaseStock = () => {
        if (amtStocksToPurchase > 0) {
            axios.post("http://localhost:5000/transaction/purchaseStock", {
                token: cookieToken.getToken(),
                password: userPw,
                stockSymbol: currentStock.symbol,
                stockName: currentStock.description,
                stockPrice: currentStock.last,
                amtOfStocks: amtStocksToPurchase,
                exchange: currentStock.exch
            }).then((response: AxiosResponse) => {

                setMessage(response.data);

                props.updateNavbar();

            }).catch((err: AxiosError) => {

                setMessage("Error purchasing");
            })
        }
    }

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
                            <h2>{currentStock.description}</h2>
                            <h2>open: ${currentStock.open}</h2>
                            <h2>close: ${currentStock.close}</h2>
                            <h2>volume: {currentStock.volume}</h2>
                            <h2>Current Cost: ${currentStock.last}</h2>
                            <h2 className={styles.Error}>{message}</h2>

                            <div>

                                <div className={styles.Container}>
                                    <p>Amt to buy:</p><input className={styles.Amt} onChange={(e) => {
                                        let amt: number = +e.target.value;
                                        console.log(amt);
                                        if (!isNaN(amt)) {
                                            setAmtStocksToPurchase(amt);
                                            setMessage('');
                                        }
                                        else {
                                            setMessage("Can only take in numbers that are greater than 0");
                                            setAmtStocksToPurchase(-1);
                                        }

                                    }}></input>

                                    <p>Your password:</p>
                                    <input onChange={(e) => setUserPw(e.target.value)}></input>
                                </div>
                                <button onClick={() => purchaseStock()}>Purchase {props.stock}</button></div>
                            <br></br>
                        </div>

                        <h1>Options</h1>

                        <div className={styles.OptionsContainer}>

                            <select >
                                {(optionExpirations != undefined && optionExpirations.length != 0) ?
                                    <option>Select an option</option> : <option>No options For {props.stock}</option>}

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


        </div >
    );
}

export default Stock;
