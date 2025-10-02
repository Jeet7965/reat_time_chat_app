import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:'user',
    initialState:{
        'user':null,
        allUsers:[],
        allChats:[],
        selectedChat:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload;
        },
        setAllUsers:(state,action)=>{
            state.allUsers=action.payload;
        },
        setAllChats:(state,action)=>{
            state.allChats=action.payload;
        },
        setSelectedChats:(state,action)=>{
            state.selectedChat=action.payload;
        },
        clearSelectedChat:(state)=>{
            return{
                ...state,selectedChat:null
            }
        }
      
    }
});

export const {setUser,clearSelectedChat,setAllUsers,setAllChats,setSelectedChats}=userSlice.actions;

export default userSlice.reducer;