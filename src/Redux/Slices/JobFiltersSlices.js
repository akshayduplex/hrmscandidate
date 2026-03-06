import { createSlice } from "@reduxjs/toolkit";

// create the stream and Location 
const initialState = {
     selectedStream: '',
     selectedLocation:'',
     filterByTitle: '',
     appliedFilter:false
}

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers:{
        setStream: (state, action) => {
            state.selectedStream = action.payload
        },
        clearFilters: (state) => {
            state.selectedStream = '';
            state.selectedLocation = '';
        },
        setLocation: (state, action) => {
            state.selectedLocation = action.payload
        },
        setFilterByTitle: (state, action) => {
            state.filterByTitle = action.payload
        },
        hasfilter:(state , action)=>{
            state.appliedFilter = action.payload
        }
    }
})

export const { setStream , setLocation , clearFilters , hasfilter , setFilterByTitle }  = filterSlice.actions;
export default filterSlice.reducer;

