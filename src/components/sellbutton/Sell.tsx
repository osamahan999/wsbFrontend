import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import styles from './Sell.module.css';
import { AxiosError, AxiosResponse } from 'axios';

const axios = require('axios');

function Sell(props: any) {
    const [amtToSell, setAmtToSell] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Type of sale
     */
    const sellInvoked = () => {
        props.isOption ? sellOption() : sellStock();
    }

    const sellOption = () => {

    }


    const sellStock = () => {
        setIsLoading(true);
        if (amtToSell <= props.amtOwned) {

            axios.post("http://localhost:5000/transaction/sellStock", {
                userId: props.userId,
                purchaseId: props.purchaseId,
                amtToSell: amtToSell,
                stockSymbol: props.ticker

            }).then((response: AxiosResponse) => {

                props.updateNavbar();
                props.updateStockPositions();
                setIsLoading(false);
            }).catch((err: AxiosError) => {
                console.log(err.response);
                setIsLoading(false);

            })
        } else alert("No, you dont own that many");
    }

    if (isLoading) return <div>Selling</div>;
    return (
        <div className={styles.SellContainer}>

            {props.amtOwned != 0 &&
                <div>

                    <input onChange={(e) => setAmtToSell(+e.target.value)} type="number" max={props.amtOwned}></input>
                    {/* <button >Sell  </button> */}
                    <Button
                        onClick={() => sellInvoked()}
                        variant="contained"
                        disabled={(amtToSell > props.amtOwned)}


                    >Sell {amtToSell + " of " + props.ticker + "?"}

                    </Button>
                </div>
            }



        </div>
    );
}

export default Sell;
