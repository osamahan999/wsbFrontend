import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import styles from './Sell.module.css';


function Sell(props: { userId: number, purchaseId: number, stockTicker: string, amtOwned: number }) {
    const [amtToSell, setAmtToSell] = useState<number>(0);


    return (
        <div className={styles.SellContainer}>

            {props.amtOwned != 0 &&
                <div>

                    <input onChange={(e) => setAmtToSell(+e.target.value)} type="number" max={props.amtOwned}></input>
                    {/* <button >Sell  </button> */}
                    <Button
                        onClick={() => alert(amtToSell)}
                        variant="contained"
                        disabled={(amtToSell > props.amtOwned)}


                    >Sell {amtToSell + " of " + props.stockTicker + "?"}

                    </Button>
                </div>
            }



        </div>
    );
}

export default Sell;
