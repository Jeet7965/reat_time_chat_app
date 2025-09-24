import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from './loaderSlice.js'

const store =configureStore({
    reducer:{loaderReducer}
});

export default store