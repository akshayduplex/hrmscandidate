import { createSlice } from "@reduxjs/toolkit";

// create the stream and Location 
const initialState = {
     file:null,
     profile_image:null,
}

const CollectFilesData = createSlice({
    name: 'files',
    initialState,
    reducers:{
        setFiles: (state, action) => {
            state.file = action.payload
        },
        setProfileImage : (state , action) => {
            state.profile_image = action.payload
        }
    }
})

export const { setFiles , setProfileImage}  = CollectFilesData.actions;
export default CollectFilesData.reducer;

