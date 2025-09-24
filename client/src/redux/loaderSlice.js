import { createSlice } from "@reduxjs/toolkit";

const loaderSlice=createSlice({
    name:'loader',
    initialState:false,
    reducers:{
        showLoader:(state)=>{
            state.loader=true;
        },
        hideLodader:(state)=>{
            state.loader=true;
        },
    }
});

export const {showLoader,hideLodader}=loaderSlice.actions;

export default loaderSlice.reducer;