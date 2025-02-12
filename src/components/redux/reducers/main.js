import { combineReducers } from "redux";
import { getProductsreducer } from "./Productsreducers";

const rootreducers = combineReducers({
    getproductsdata: getProductsreducer,
});

export default rootreducers;
