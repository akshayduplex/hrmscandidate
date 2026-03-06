import { configureStore } from "@reduxjs/toolkit";
import filterReducer from '../Slices/JobFiltersSlices';
import jobReducer from '../Slices/JobListApi';
import fileData from '../Slices/ImagefileCollectSlice'


const ConfigureStore = configureStore({
    reducer: {
        filter:filterReducer,
        jobs: jobReducer,
        files:fileData
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['files/setFiles'],
                ignoredPaths: ['files.file'],
            },
        }),

})

export default ConfigureStore;