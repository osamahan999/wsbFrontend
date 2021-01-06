import Modal from "@material-ui/core/Modal";
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import Sidefiller from '../../components/sidefiller/Sidefiller';


import styles from './Stock.module.css';

const axios = require('axios');
const cookieToken = require('../../helper');


function Stock(props: any) {

    const [currentStock, setCurrentStock] = useState<JSON | any>();

    const [userPw, setUserPw] = useState<string>('');

    //states for purchasing stocks
    const [amtStocksToPurchase, setAmtStocksToPurchase] = useState<number>(0);
    const [stockPurchaseModalOpen, setStockPurchaseModalOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    //States for purchasing options 
    const [amtOfContractsToPurchase, setAmtOfContractsToPurchase] = useState<number>(0);
    const [optionPurchaseModalOpen, setOptionPurchaseModalOpen] = useState<boolean>(false);

    //Option data
    const [optionInView, setOptionInView] = useState<JSON | any>();
    const [optionExpirations, setOptionExpirations] = useState<Array<string>>([]);
    const [pulledOptions, setPulledOptions] = useState<Array<JSON>>([]);
    const [expirationInView, setExpirationInView] = useState<string>();

    const [optionType, setOptionType] = useState<string>('call');
    const [loadingOptions, setLoadingOptions] = useState<boolean>(false);

    useEffect(() => {
        axios.get("http://localhost:5000/stockData/getStockQuote", {
            params: {
                'symbol': props.stock
            }
        }).then((response: AxiosResponse) => {
            setCurrentStock(response.data);
        }).catch((err: AxiosError) => {
            alert(err.response);

        })
    }, [])

    useEffect(() => {
        expirationInView != undefined &&
            getOptions(currentStock.symbol, expirationInView);

    }, [optionType])


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

    /**
     * Purchases the amt of stocks specified for the logged in user
     */
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
        } else { setMessage("Must be amt > 0") }
    }


    /**
    * Purchases the amt of options specified for the logged in user
    */
    const purchaseOption = () => {
        if (amtOfContractsToPurchase > 0) {
            axios.post("http://localhost:5000/transaction/purchaseOption", {
                token: cookieToken.getToken(),
                password: userPw,
                optionSymbol: optionInView.symbol,
                optionPrice: (optionInView.last * 100), //100x shares
                amtOfContracts: amtOfContractsToPurchase
            }).then((response: AxiosResponse) => {

                setMessage(response.data);

                props.updateNavbar();

            }).catch((err: AxiosError) => {
                setMessage("Error purchasing");
            })
        } else { setMessage("Must be amt > 0") }
    }


    /**
     * Gets the options at a specified date for the stock
     * @param symbol 
     * @param date 
     */
    const getOptions = (symbol: string, date: string) => {
        setLoadingOptions(true);

        axios.get("http://localhost:5000/stockData/getOptionsOnDate", {
            params: {
                'symbol': symbol,
                'expiration': date,
                'optionType': optionType
            }
        }).then((response: AxiosResponse) => {
            setPulledOptions(response.data);
            setLoadingOptions(false);
        }).catch((err: AxiosError) => {
            setPulledOptions([]);
            setLoadingOptions(false);


        })
    }


    return (

        <div className={styles.Stock}>


            <div className={styles.ContentContainer}>
                {currentStock != undefined &&
                    <div className={styles.container}>
                        <div className={styles.StockData}>
                            <h2>{currentStock.description}</h2>
                            <h2>open: ${currentStock.open}</h2>
                            <h2>close: ${currentStock.close}</h2>
                            <h2>volume: {currentStock.volume}</h2>
                            <h2>Current Cost: ${currentStock.last}</h2>

                            <div>


                                <button onClick={() => setStockPurchaseModalOpen(true)}>Purchase {props.stock}</button></div>
                            <div>

                            </div>
                            <Modal
                                className={styles.ModalContainer}
                                open={stockPurchaseModalOpen}
                                onClose={() => {
                                    setStockPurchaseModalOpen(false);
                                    setAmtStocksToPurchase(0);
                                    setMessage("");
                                    setUserPw("");


                                }}
                            >
                                <div className={styles.Modal}>
                                    <div>Amt:</div>
                                    <input type="number" max="1000" min="1" onChange={(e) => setAmtStocksToPurchase(+(e.target.value))}></input>
                                    <div>
                                        <div>Your tendies after purchasing {amtStocksToPurchase} {props.stock} stocks:

                                        ${(Math.round(1000 * (+(props.currentUser.total_money) - ((+amtStocksToPurchase) * (+currentStock.last)))) / 1000)}</div>
                                    </div>
                                    <div>
                                        <p>Your password:</p>
                                        <input onChange={(e) => setUserPw(e.target.value)}></input>
                                        <button onClick={() => {
                                            if (+(props.currentUser.total_money) < ((+amtStocksToPurchase) * (+currentStock.last))) setMessage('Not enough funds!')
                                            else {
                                                purchaseStock();
                                            }
                                        }}>Purchase {amtStocksToPurchase + " of " + props.stock}</button>
                                    </div>


                                    <h2 className={styles.Error}>{message}</h2>

                                </div>

                            </Modal>
                            <br></br>
                        </div>

                        <h1>Options</h1>

                        <div className={styles.OptionsContainer}>

                            <select >
                                {(optionExpirations != undefined && optionExpirations.length != 0) ?
                                    <option onClick={() => {
                                        setPulledOptions([]);
                                        setExpirationInView("");
                                    }}>Select an option</option> : <option>No options For {props.stock}</option>}

                                {(optionExpirations != undefined && optionExpirations.length != 0) &&
                                    optionExpirations.map((date) => {
                                        return (
                                            <option className={styles.Option}
                                                onClick={() => {
                                                    getOptions(props.stock, date);
                                                    setExpirationInView(date);
                                                }}>
                                                {date}</option>
                                        );
                                    })}
                            </select>


                        </div>

                    </div>
                }

            </div>


            {loadingOptions ? <div className={styles.PulledOptions}>loading</div> : <div className={styles.PulledOptions}>
                <div className={styles.DescriptionContainer}>
                    <h2>{expirationInView}</h2>
                    {expirationInView != undefined && <button onClick={() => {
                        if (optionType == 'call') {
                            setOptionType('put');
                        }
                        else if (optionType == 'put') {
                            setOptionType('call');
                        }

                    }}>
                        Show {optionType == 'call' ? "put" : "call"}
                    </button>}

                    {(pulledOptions != undefined || pulledOptions != []) && pulledOptions.map((option: any) => {
                        return (<p onClick={() => setOptionInView(option)} className={styles.Option}>{option.description + " at $" + option.last}</p>)
                    })}

                </div>
                {optionInView != undefined &&
                    <div className={styles.OptionDetailsContainer}>
                        <h2>Option Details</h2>

                        <button onClick={() => setOptionPurchaseModalOpen(true)}>Purchase contract</button>
                        <Modal
                            className={styles.ModalContainer}
                            open={optionPurchaseModalOpen}
                            onClose={() => {
                                setOptionPurchaseModalOpen(false);
                                setAmtOfContractsToPurchase(0);
                                setMessage("");
                                setUserPw("");


                            }}
                        >
                            <div className={styles.Modal}>
                                <div><b>Amt:</b></div>
                                <div><input type="number" max="1000" min="1" onChange={(e) => setAmtOfContractsToPurchase(+(e.target.value))}></input>
                                    Total: ${100 * amtOfContractsToPurchase * optionInView.last}</div>
                                <div>
                                    <div>Your tendies after purchasing {amtOfContractsToPurchase} {optionInView.description} contracts:

                                        ${(Math.round(1000 * (+(props.currentUser.total_money) - ((+amtOfContractsToPurchase) * (+optionInView.last)))) / 1000)}</div>
                                </div>
                                <div>
                                    <p><b>Your password:</b></p>
                                    <input onChange={(e) => setUserPw(e.target.value)}></input>
                                    <button onClick={() => {
                                        if (+(props.currentUser.total_money) < ((+amtOfContractsToPurchase) * (+optionInView.last))) setMessage('Not enough funds!')
                                        else {
                                            purchaseOption();
                                        }
                                    }}>Purchase {amtOfContractsToPurchase + " of this contract"}</button>
                                </div>


                                <h2 className={styles.Error}>{message}</h2>

                            </div>

                        </Modal>


                        <p>{optionInView.description}</p>
                        <p><b>Cost of Contract (100x shares): </b>${optionInView.ask}</p>

                        <p>Volume: {optionInView.volume}</p>

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
            </div>}


            <div className={styles.ContentContainer}>
                <h2>Your positions</h2>
            </div>


        </div >
    );
}

export default Stock;
