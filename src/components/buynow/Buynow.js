import React from 'react'
import "./buynow.css";
import {Divider} from '@mui/material';
import Option from './Option';
import Subtotal from './Subtotal';
import Right from './Right';

const Buynow = () => {
  return (
    <div className="buynow_section">
        <div className="buynow_container">
            <div className="left_buy">
                <h1>Shopping Cart</h1>
                <p>Select all Items</p>
                <span className='leftbuyprice'>Price</span>
                <Divider/>

                <div className="item_container">
                    <img src="https://rukminim1.flixcart.com/image/416/416/kll7bm80/smartwatch/c/1/n/43-mo-sw-sense-500-android-ios-molife-original-imagyzyycnpujyjh.jpeg?q=70" alt=""/>
                    <div className="items_details">
                        <h3>Fastrack Smartwatch(Black Strap,Freesize</h3>
                        <h3>Smart Watches</h3>
                        <h3 className='differentprice'>₹4049.00</h3>
                        <p className='unusuall'>Usually Dispatched in 8 days.</p>
                        <p>Eligible for FREE Shipping </p>
                        <img src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px-2x._CB485942108_.png" alt="logo" />
                        <Option/>
                        <Subtotal/>
                    </div>
    
                    
                </div>
                <Divider/>
            </div>
            <Right/>

        </div>
      
    </div>
  )
}

export default Buynow
