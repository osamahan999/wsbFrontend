import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';


import SidefillerLeft from '../../components/sidefiller/SidefillerLeft';
import SidefillerRight from '../../components/sidefiller/SidefillerRight';


import Autocomplete from '@material-ui/lab/Autocomplete';

import styles from './UserFeed.module.css';
import { TextField } from '@material-ui/core';
import Sell from '../../components/sellbutton/Sell';

const axios = require('axios');


function UserFeed(props: any) {

    const [username, setUsername] = useState('');
    const [totalMoney, setTotalMoney] = useState(0);
    const [userId, setUserId] = useState(-1);

    const [searchInput, setSearchInput] = useState('');
    const [stocksInDropdown, setStocksInDropdown] = useState<any[]>([]);

    const [ownedStocks, setOwnedStocks] = useState<Array<JSON>>([]);
    const [ownedContracts, setOwnedContracts] = useState<Array<JSON>>([]);

    useEffect(() => {
        setUsername(props.user.username);
        setTotalMoney(props.user.total_money);
        setUserId(props.user.user_id);

    }, [])

    useEffect(() => {
        getUserStocks();
        getUserContracts();

    }, [userId]);


    const getUserStocks = () => {
        if (userId != -1) {
            axios.get("http://localhost:5000/transaction/getSpecificPosition", {
                params: {
                    'userId': userId
                }
            }).then((response: AxiosResponse) => {
                setOwnedStocks(response.data.positions);
            }).catch((err: AxiosError) => {
                console.log(err);
            })
        }
    }

    const getUserContracts = () => {
        if (userId != -1) {
            axios.get("http://localhost:5000/transaction/getSpecificOptionPosition", {
                params: {
                    'userId': userId
                }
            }).then((response: AxiosResponse) => {
                setOwnedContracts(response.data.positions);
            }).catch((err: AxiosError) => {
                console.log(err.response);
            })
        }
    }

    const setExpired = (underlying: string) => {
        if (userId != -1) {
            axios.post("http://localhost:5000/transaction/setOptionToExpired", {
                "userId": userId,
                "optionSymbol": underlying
            }).then((response: AxiosResponse) => {
                getUserContracts();
                console.log(response.data);
            }).catch((err: AxiosError) => {
                console.log(err.response);
            })
        }
    }

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

            <SidefillerLeft />


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


                <div>
                    <h3>Owned shares:</h3>
                    {ownedStocks.map((stock: JSON | any) => {
                        return (
                            <div className={styles.PositionData}>
                                You have {(stock.amt_of_purchase - stock.amt_sold) + " share of " + stock.stock_symbol + " stock, purchased at $" + stock.price_at_purchase}
                                <button className={styles.GoToButton} onClick={() => {
                                    props.setCurrentStock(stock.stock_symbol);
                                    props.setCurrentPage('stock');
                                }}>Go to {stock.stock_symbol} </button>
                                <Sell
                                    userId={userId}
                                    purchaseId={stock.purchase_id}
                                    ticker={stock.stock_symbol}

                                    amtOwned={stock.amt_of_purchase - stock.amt_sold}
                                    isOption={false}
                                    updateStockPositions={() => getUserStocks()}
                                    updateNavbar={() => props.updateNavbar()}
                                />
                            </div>);
                    })}

                    <h3>Owned contracts</h3>
                    {ownedContracts != null && ownedContracts.map((contract: JSON | any) => {
                        if (contract != null) return (
                            <div className={styles.PositionData}>
                                <h4>{contract.description}</h4>
                                <button className={styles.GoToButton} onClick={() => setExpired(contract.underlying)}>Ashamed? Mark as seen</button>
                                <h4>Option ticker: {contract.underlying}</h4>

                                { (contract.amt_of_contracts - contract.amt_sold)
                                    + " contracts worth $" + contract.ask + " purchased for $" + contract.price_at_purchase}
                                <div>You {contract.ask - contract.price_at_purchase >= 0 ? "profited " : "lost "}
                                ${contract.ask * contract.amt_of_contracts - contract.price_at_purchase * contract.amt_of_contracts} </div>
                                {contract.description != "expired" && <Sell
                                    userId={userId}
                                    purchaseId={contract.option_purchase_id}
                                    ticker={contract.option_symbol}

                                    amtOwned={(contract.amt_of_contracts - contract.amt_sold)}
                                    isOption={true}
                                    updateStockPositions={() => getUserContracts()}
                                    updateNavbar={() => props.updateNavbar()}
                                />}
                            </div>
                        );
                    })}
                </div>
            </div>
            <SidefillerRight />


        </div>
    );
}

export default UserFeed;
