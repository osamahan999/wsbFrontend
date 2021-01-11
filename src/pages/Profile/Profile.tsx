import { AxiosError, AxiosResponse } from 'axios';
import { error } from 'console';
import React, { useEffect, useState } from 'react';


import SidefillerLeft from '../../components/sidefiller/SidefillerLeft';
import SidefillerRight from '../../components/sidefiller/SidefillerRight';



import styles from './Profile.module.css';


const axios = require('axios');

function Profile(props: any) {

    const [renderedStockHistory, setRenderedStockHistory] = useState<Array<JSON | any>>([]);
    const [stocksOrContracts, setStocksOrContracts] = useState<String>("stocks");

    const [loading, setLoading] = useState<boolean>(false);



    useEffect(() => {
        getHistory();
    }, [stocksOrContracts])


    const getHistory = () => {
        console.log('history called');

        if (stocksOrContracts == "stocks") getUserStocks();
        else getUserContracts();
    }

    const getUserStocks = () => {
        if (props.currentUser != null) {

            setLoading(true);

            axios.get("http://localhost:5000/transaction/getUserStockHistory", {
                params: {
                    "userId": props.currentUser.user_id
                }
            }).then((response: AxiosResponse) => {
                console.log(response.data)
                setRenderedStockHistory(response.data);

                setLoading(false);

            }).catch((error: AxiosError) => {
                console.log(error.response)

                setLoading(false);

            })
        } else console.log("User not set");
    }

    const getUserContracts = () => {
        if (props.currentUser != null) {
            setLoading(true);


            axios.get("http://localhost:5000/transaction/getUserContractHistory", {
                params: {
                    "userId": props.currentUser.user_id
                }
            }).then((response: AxiosResponse) => {
                console.log(response.data)
                setRenderedStockHistory(response.data);

                setLoading(false);

            }).catch((error: AxiosError) => {
                console.log(error.response)

                setLoading(false);

            })
        } else console.log("User not set");
    }



    //TODO: Add symbol filter
    //TODO: Add date filter 
    //TODO: Add 'Get sales' button

    return (

        <div className={styles.Profile}>
            <SidefillerLeft />
            <div className={styles.UserContent}>
                <button onClick={() => {

                    stocksOrContracts == "stocks" ? setStocksOrContracts("options") : setStocksOrContracts("stocks");
                }}>Show {stocksOrContracts == "stocks" ? "options" : "stocks"}</button>



                {!loading ?

                    <div className={styles.StockHistory}>
                        <h3>Your {stocksOrContracts} purchase history</h3>
                        {renderedStockHistory.length != 0 && renderedStockHistory.map((position) => {
                            return (
                                <div>
                                    <h4> {stocksOrContracts == "stocks" ? position.stock_symbol : position.option_symbol} </h4>
                                    <div>Purchased {position.amt_of_purchase} on {(new Date(position.date_purchased)).toDateString()}</div>
                                    <div>Cost at purchase: ${position.price_at_purchase} each</div>
                                    <div>Amount of shares still owned from this purchase:
                                        {stocksOrContracts == "stocks" ? position.amt_of_purchase - position.amt_sold
                                            : position.amt_of_contracts - position.amt_sold}</div>

                                </div>
                            )
                        })}
                    </div>
                    :

                    (<div>Getting your history</div>)

                }
            </div>
            <SidefillerRight />
        </div >
    );
}

export default Profile;
