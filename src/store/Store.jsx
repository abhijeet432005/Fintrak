import { configureStore } from "@reduxjs/toolkit";
import transactionreducer from "./reducer/TransactionSlice";

const store = configureStore({
    reducer: {
        transaction: transactionreducer,
    },
})


export default store;