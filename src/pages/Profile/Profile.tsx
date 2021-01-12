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
    const [salesOrPurchases, setSalesOrPurchases] = useState<String>("sales");
    const [filterBySymbol, setFilterBySymbol] = useState<String>();

    const [stockSalesNet, setStockSalesNet] = useState<number>(0);
    const [optionSalesNet, setOptionsSalesNet] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);



    useEffect(() => {
        getHistory();
    }, [stocksOrContracts, salesOrPurchases])


    const getHistory = () => {
        console.log('history called');

        if (stocksOrContracts == "stocks") getUserStocks();
        else getUserContracts();
    }

    /**
     * Calls getUserStocks but with a filter which is optional
     */
    const getFilteredHistory = () => {
        if (stocksOrContracts == "stocks") {
            if (filterBySymbol != undefined && filterBySymbol.length == 0) {
                getUserStocks();
            } else {
                getUserStocks(filterBySymbol)

            }
        }
        else {
            if (filterBySymbol != undefined && filterBySymbol.length) {
                getUserContracts(filterBySymbol)
            }
            else {
                getUserContracts()
            }
        }
    }

    const getUserStocks = (filter?: string | any) => {
        if (props.currentUser != null) {

            setLoading(true);

            axios.get("https://wallstreet-bets-tycoon-backend.uc.r.appspot.com/transaction/getUserStockHistory", {
                params: {
                    "userId": props.currentUser.user_id,
                    "salesOrPurchases": salesOrPurchases,
                    "filter": filterBySymbol
                }
            }).then((response: AxiosResponse) => {
                console.log(response.data)
                setRenderedStockHistory(response.data);

                setLoading(false);

                if (salesOrPurchases == "sales") {
                    let sum: number = 0;
                    for (let i = 0; i < response.data.length; i++) {
                        sum += (Math.round(((response.data[i].price_at_sale * response.data[i].amt_sold)
                            - (response.data[i].price_at_purchase * response.data[i].amt_sold)) * 100) / 100)
                    }

                    setStockSalesNet(sum);
                }


            }).catch((error: AxiosError) => {
                console.log(error.response)

                setLoading(false);

            })
        } else console.log("User not set");
    }

    const getUserContracts = (filter?: string | any) => {
        if (props.currentUser != null) {
            setLoading(true);


            axios.get("https://wallstreet-bets-tycoon-backend.uc.r.appspot.com/transaction/getUserContractHistory", {
                params: {
                    "userId": props.currentUser.user_id,
                    "salesOrPurchases": salesOrPurchases,
                    "filter": filterBySymbol
                }
            }).then((response: AxiosResponse) => {
                console.log(response.data)
                setRenderedStockHistory(response.data);

                setLoading(false);


                if (salesOrPurchases == "sales") {
                    let sum: number = 0;
                    for (let i = 0; i < response.data.length; i++) {
                        sum += ((response.data[i].price_at_sale * response.data[i].amt_sold)
                            - (response.data[i].price_at_purchase * response.data[i].amt_sold))
                    }

                    setOptionsSalesNet(sum);
                }
            }).catch((error: AxiosError) => {
                console.log(error.response)

                setLoading(false);

            })
        } else console.log("User not set");
    }


    return (

        <div className={styles.Profile}>
            <SidefillerLeft />
            <div className={styles.UserContent}>
                <div>
                    <button className={styles.Button} onClick={() => {

                        stocksOrContracts == "stocks" ? setStocksOrContracts("options") : setStocksOrContracts("stocks");
                    }}>Show {stocksOrContracts == "stocks" ? "options" : "stocks"}</button>
                    <button className={styles.Button} onClick={() => {
                        salesOrPurchases == "sales" ? setSalesOrPurchases("purchases") : setSalesOrPurchases("sales");

                    }}>Show {salesOrPurchases == "sales" ? "purchases" : "sales"}</button>
                    <div>
                        <input onChange={(e) => setFilterBySymbol(e.target.value)} placeholder={"Filter by symbol?"}></input>
                        <button className={styles.Button} onClick={() => getFilteredHistory()}>Filter</button>
                    </div>
                </div>



                {!loading ?

                    <div className={styles.StockHistory}>

                        {stocksOrContracts == "stocks" ?
                            <div>
                                <h3>Your stock {salesOrPurchases} history</h3>
                                {salesOrPurchases == "sales" && <div>Net gain/loss: ${stockSalesNet}</div>}
                                {renderedStockHistory.length != 0 && renderedStockHistory.map((position) => {
                                    return (

                                        salesOrPurchases == "sales" ?
                                            <div>

                                                <h3>{position.stock_symbol}</h3>
                                                <div> Sold {position.amt_sold} shares on
                                         {" " + (new Date(position.date_sold)).toDateString()} for ${position.price_at_sale} each</div>
                                                <div>Initially purchased for ${position.price_at_purchase}</div>

                                                <div> You {(position.price_at_sale - position.price_at_purchase) >= 0 ? "profited" : "lost"}
                                                    {" $" + +(Math.round(((position.price_at_sale * position.amt_sold) - (position.price_at_purchase * position.amt_sold)) * 100) / 100)}</div>

                                            </div>
                                            :
                                            <div>
                                                <h3>{position.stock_symbol}</h3>
                                                <div>Purchased {position.amt_of_purchase} shares on {(new Date(position.date_purchased)).toDateString()}</div>
                                                <div> Each share cost ${position.price_at_purchase + " "}
                                        for a total of ${Math.round(position.price_at_purchase * position.amt_of_purchase * 100) / 100}</div>
                                                <div>{(position.amt_of_purchase - position.amt_sold) != 0
                                                    ? "You still have " + (position.amt_of_purchase - position.amt_sold) + " shares from this purchase"
                                                    : "You have no remaining shares from this purchase"}
                                                </div>
                                            </div>


                                    )
                                })}
                            </div>

                            :
                            <div>
                                <h3>Your contract {salesOrPurchases} history</h3>
                                {salesOrPurchases == "sales" && <div>Net gain/loss: ${optionSalesNet}</div>}
                                {renderedStockHistory.length != 0 &&
                                    renderedStockHistory.map((position) => {
                                        return (
                                            salesOrPurchases == "sales" ?
                                                <div>
                                                    <h3>{position.option_symbol}</h3>
                                                    <div> Sold {position.amt_sold} contracts on
                                                        {" " + (new Date(position.date_sold)).toDateString()} for ${position.price_at_sale} each</div>
                                                    <div>Initially purchased for ${position.price_at_purchase}</div>

                                                    <div> You {(position.price_at_sale - position.price_at_purchase) >= 0 ? "profited" : "lost"}
                                                        {" $" + +(Math.round(((position.price_at_sale * position.amt_sold)
                                                            - (position.price_at_purchase * position.amt_sold)) * 100) / 100)}</div>

                                                </div>
                                                :
                                                <div>
                                                    <h3>{position.option_symbol}</h3>
                                                    <div>Purchased {position.amt_of_contracts} contracts on
                                                        {" " + (new Date(position.date_purchased)).toDateString()}</div>
                                                    <div> Each contract cost ${position.price_at_purchase + " "}
                                                        for a total of
                                                        {" $" + Math.round(position.price_at_purchase * position.amt_of_contracts * 100) / 100}</div>
                                                    <div>
                                                        {(position.amt_of_contracts - position.amt_sold) != 0
                                                            ? "You still have " + (position.amt_of_contracts - position.amt_sold) + " contracts from this purchase"
                                                            : "You have no remaining contracts from this purchase"}
                                                    </div>
                                                </div>
                                        );
                                    })

                                }


                            </div>
                        }






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
