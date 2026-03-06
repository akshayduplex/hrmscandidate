import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../Config/Config";
import { apiHeaderToken, apiHeaderTokenMultiPart } from "../../Headers/CustomeHeaders";


const initialState = {
    jobsList: {
        data: [],
        status: 'idle',
        error: null,
    },
    jobApplyResponse: {
        data: [],
        status: 'idle',
        error: null,
    },
    packages: {
        data: [],
        status: 'idle',
        error: null,
    },
    jobTypes: {
        data:[],
        status:'idle',
        error:null,
    },
    suggestion: {
        suggestions: [],
        status: 'idle',
        error: null,
    },
    designationSuggestion:{
        data:[],
        status:'idle',
        error:null,
    },
    jobRecordsById: {
        data: {},
        status: 'idle',
        error: null,
    },
    departmentSuggestion: {
        data:[],
        status:'idle',
        error:null
    },
    webSettingData: {
        data:[],
        status:'idle',
        error:null
    },
    CmsPageSlug: {
        data:[],
        status:'idle',
        error:null
    },
    totalCount: {
        data: 0,
        status: 'idle',
        error: null,
    }
};


export const FetchJobsList = createAsyncThunk(
    'JobsList/FetchJobsList',
    async ( {stream,  location , par_Page_record , job_type , salary_range , days , relevant , filterByTitle , slug} ) => {
        try {
            let Payloads = {
                keyword:filterByTitle ? filterByTitle : '',
                department:stream === 'All' ? '' : stream,
                location:location === 'All' ? '' : location,
                slug:slug,
                // location:Location ? Location : '',
                page_no:'1',
                per_page_record:par_Page_record ?  par_Page_record :  '10000',
                job_type:job_type,
                salary_range:salary_range ? salary_range : '',
                days: days ? days : '',
                job_title: relevant,
                scope_fields:[
                    "project_id",
                    "project_name",
                    "description",
                    "department",
                    "job_title",
                    "job_type",
                    "experience",
                    "salary_range",
                    "location",
                    "add_date",
                    "working",
                    "company",
                    "deadline",
                    "benefits",
                    "designation",
                    "total_vacancy",
                    "job_title_slug",
                    "job_publish_code",
                ],
                status:'Published'
            }
            const response = await axios.post(`${config.BASE_URL}/front/getJobList`, Payloads , apiHeaderToken(config.API_TOKEN));
            console.log( response , 'this is Data From the Total Records Of it' )
            if(response.status === 200){
                return response.data
            }else if (response.status === 204){
                return [];
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
)

export const FetchJobsListTotal = createAsyncThunk(
    'FetchJobsListTotal/totalCount',
    async ( {stream,  location , par_Page_record , job_type , salary_range , days , relevant , filterByTitle} ) => {
        try {
            let Payloads = {
                keyword:filterByTitle ? filterByTitle : '',
                department:stream === 'All' ? '' : stream,
                location:location === 'All' ? '' : location,
                is_count:'yes',
                page_no:'1',
                per_page_record:par_Page_record ?  par_Page_record :  '100',
                job_type:job_type,
                salary_range:salary_range ? salary_range : '',
                days: days ? days : '',
                job_title: relevant,
                scope_fields:[
                    "project_id",
                    "project_name",
                    "description",
                    "department",
                    "job_title",
                    "job_type",
                    "experience",
                    "salary_range",
                    "location",
                    "add_date",
                    "working",
                    "company",
                    "deadline",
                    "benefits",
                    "designation",
                    "total_vacancy",
                    "job_title_slug",
                    "job_publish_code",
                ],
                status:'Published'
            }
            const response = await axios.post(`${config.BASE_URL}/front/getJobList`, Payloads , apiHeaderToken(config.API_TOKEN));
            console.log( response , 'this is Data From the Total Records Of it' )
            if(response.status === 200){
                return response.data
            }else if (response.status === 204){
                return [];
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
)

// Job apply submit
export const JobApplySubmit = createAsyncThunk(
    'JobsList/JobApplySubmit',
    async ( formData ) => {
        try {
            let response = await axios.post(`${config.BASE_URL}/front/applyJob` , formData , apiHeaderTokenMultiPart(config.API_TOKEN))
            if(response.status === 200){
                return Promise.resolve(response.data);
            }else{
                return Promise.reject(response.data);
            }
        } catch (error) {
             return Promise.reject(error);
            // throw new Error(error.message)
        }
    }
)

// Salary ranges from the packages

export const fetchPackages = createAsyncThunk(
    'packages/fetchPackages',
    async () => {
        try {
            let Payloads = {
               keyword:'',
               page_no:'1',
               per_page_record:"100",
               status:'Active'
            }
            // {"keyword":"","page_no":"1","per_page_record":"","scope_fields":["_id","label","from","to"],"status":"Active" }
            let response = await axios.post(`${config.BASE_URL}/global/getSalaryRangeList` , Payloads , apiHeaderToken(config.API_TOKEN))
            if(response.data.status){
                return response.data.data
            }else {
                return []
            }
        } catch (error) {
            throw new Error(error.message)
            
        }
    }
);

// jobs types 
export const JobTypes = createAsyncThunk(
    'jobTypes/JobTypes',
    async () => {
        try {
            let Payloads = {
                keyword:'',
                page_no:'1',
                per_page_record:"100",
                status:'Active'
             }
            let response = await axios.post(`${config.BASE_URL}/global/getJobTypeList` , Payloads , apiHeaderToken(config.API_TOKEN))
            if(response.data.status){
                return response.data.data
            }else {
                return []
            }

        } catch (error) {
            throw new Error(error.message);
        }
    }
)

// city List api 
export const fetchCitySuggestions = createAsyncThunk(
    'cities/fetchCitySuggestions',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads = {
                keyword: inputValue,
                page_no: '1',
                per_page_record: '10',
            };

            const response = await axios.post(
                `${config.BASE_URL}/global/getLocationList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );

            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key.name,
                    label: `${key.name} , ${key.state}`,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchDesignationSuggestions = createAsyncThunk(
    'designationSuggestion/fetchDesignationSuggestions',
    async (inputValue, { rejectWithValue }) => {
        // if (inputValue.length === 0) return [];
        try {
            const Payloads = {
                keyword: inputValue,
                page_no: '1',
                per_page_record: '10',
            };
            const response = await axios.post(
                `${config.BASE_URL}/global/getDepartmentList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
           
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key.name,
                    label: key.name,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// fetch data by id 
export const fetchRecordsById = createAsyncThunk(
    'jobRecordsById/fetchRecordsById',
    async ({ id }) => {
        try {
            const Payloads = {
                _id: id,
                scope_fields: [
                    "_id",
                    "project_name",
                    "department",
                    "job_title",
                    "job_type",
                    "experience",
                    "location",
                    "salary_range",
                    "deadline",
                    "benefits",
                    "working",
                    "project_id",
                    "project_name",
                    "form_personal_data",
                    "designation",
                    "designation_id",
                    "form_profile",
                    "form_social_links"
                ]
            };
            const response = await axios.post(
                `${config.BASE_URL}/front/getJobById`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.status === 200) {
                return response.data.data;
            } else {
                return {};
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
)

// department List suggestion
export const DepartmentSuggestions = createAsyncThunk(
    'departmentSuggestion/DepartmentSuggestions',
    async (inputValue, { rejectWithValue }) => {
        try {
            const Payloads = {
                keyword: inputValue,
                page_no: '1',
                per_page_record: '10',
            };
            const response = await axios.post(
                `${config.BASE_URL}/global/getDesignationList`,
                Payloads,
                apiHeaderToken(config.API_TOKEN)
            );
            if (response.data.status) {
                return response.data.data.map(key => ({
                    value: key.name,
                    label: key.name,
                }));
            } else {
                return [];
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Configration Setting API ->
export const CMSPageSlug = createAsyncThunk(
    'CMSPageSlug/CMSPageSlug',
    async ( payload , { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.BASE_URL}/front/getCmsDataBySlug` , payload)
            if(response.status === 200){
                return response.data?.data
            }else {
                return {}
            }
        } catch (error) {
            rejectWithValue(error?.response?.data || error?.message)
        }
    }
)
export const ConfigrationSetting = createAsyncThunk(
    'configrationSetting/ConfigrationSetting',
    async ( payload , { rejectWithValue }) => {
        try {
            let response = await axios.post(`${config.BASE_URL}/front/getWebConfigData` , payload)
            if(response.status === 200){
                return response.data?.data
            }else {
                return {}
            }
        } catch (error) {
            rejectWithValue(error?.response?.data || error?.message)
        }
    }
)



const JobApiListSlice = createSlice({
    name: 'JobsList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(FetchJobsList.pending , (state) => {
            state.jobsList.status = 'loading'
        })
        .addCase(FetchJobsList.fulfilled , (state , action) => {
            state.jobsList.status = 'succeeded'
            state.jobsList.data = action.payload
        })
        .addCase(FetchJobsList.rejected , (state , action) => {
            state.jobsList.status = 'failed'
            state.jobsList.error = action.error.message;
        })
        .addCase(JobApplySubmit.pending , (state) => {
            state.jobApplyResponse.status = 'loading';
        })
        .addCase(JobApplySubmit.fulfilled , (state , action) => {
            state.jobApplyResponse.status = 'succeeded';
            state.jobApplyResponse.data = action.payload;
        })
        .addCase(JobApplySubmit.rejected , (state , action) => {
            state.jobApplyResponse.status = 'failed';
            state.jobApplyResponse.error = action.error.message;
        })
        .addCase(fetchPackages.pending , (status) => {
            status.packages.status = 'loading';
        })
        .addCase(fetchPackages.fulfilled , ( state , action ) => {
            state.packages.status = 'succeeded';
            state.packages.data = action.payload;
        })
        .addCase(fetchPackages.rejected , (state , action) => {
            state.packages.status = 'failed';
            state.packages.error = action.error.message;
        })
        .addCase(JobTypes.pending , (state) => {
            state.jobTypes.status = 'loading';
        })
        .addCase(JobTypes.fulfilled , (state , action) => {
            state.jobTypes.status = 'succeeded'
            state.jobTypes.data = action.payload;
        })
        .addCase(JobTypes.rejected , (state , action) => {
            state.jobTypes.status = 'failed'
            state.jobTypes.error = action.error.message;
        })
        .addCase(fetchCitySuggestions.pending, (state) => {
            state.suggestion.status = 'loading';
        })
        .addCase(fetchCitySuggestions.fulfilled, (state, action) => {
            state.suggestion.status = 'succeeded';
            state.suggestion.suggestions = action.payload;
        })
        .addCase(fetchCitySuggestions.rejected, (state, action) => {
            state.suggestion.status = 'failed';
            state.suggestion.error = action.payload;
        })
        .addCase(fetchDesignationSuggestions.pending, (state) => {
            state.designationSuggestion.status = 'loading';
        })
        .addCase(fetchDesignationSuggestions.fulfilled, (state, action) => {
            state.designationSuggestion.status = 'succeeded';
            state.designationSuggestion.data = action.payload;
        })
        .addCase(fetchDesignationSuggestions.rejected, (state, action) => {
            state.designationSuggestion.status = 'failed';
            state.designationSuggestion.error = action.payload;
        })
        .addCase(fetchRecordsById.pending , (state) => {
            state.jobRecordsById.status = 'loading';
        })
        .addCase(fetchRecordsById.fulfilled , (state , action) => {
            state.jobRecordsById.status = 'succeeded';
            state.jobRecordsById.data = action.payload;
        })
        .addCase(fetchRecordsById.rejected , (state , action) => {
            state.jobRecordsById.status = 'failed';
            state.jobRecordsById.error = action.error.message;
        })
        .addCase(DepartmentSuggestions.pending , (state) => {
            state.departmentSuggestion.status = 'loading';
        })
        .addCase(DepartmentSuggestions.fulfilled , (state , action) => {
            state.departmentSuggestion.status = 'succeeded';
            state.departmentSuggestion.data = action.payload;
        })
        .addCase(DepartmentSuggestions.rejected , (state , action) => {
            state.departmentSuggestion.status = 'failed';
            state.departmentSuggestion.error = action.error.message;
        })
        .addCase(ConfigrationSetting.pending , (state) => {
            state.webSettingData.status = 'loading';
        })
        .addCase(ConfigrationSetting.fulfilled , (state , action) => {
            state.webSettingData.status = 'succeeded';
            state.webSettingData.data = action.payload;
        })
        .addCase(ConfigrationSetting.rejected , (state , action) => {
            state.webSettingData.status = 'failed';
            state.webSettingData.error = action.error
        } )
        .addCase(CMSPageSlug.pending , (state) => {
            state.CmsPageSlug.status = 'loading';
        })
        .addCase(CMSPageSlug.fulfilled , (state , action) => {
            state.CmsPageSlug.status = 'succeeded';
            state.CmsPageSlug.data = action.payload;
        })
        .addCase(CMSPageSlug.rejected , (state , action) => {
            state.CmsPageSlug.status = 'failed';
            state.CmsPageSlug.error = action.error
        } )
        .addCase(FetchJobsListTotal.pending , (state) => {
            state.totalCount.data = 0;
            state.totalCount.status = 'loading';
        })
        .addCase(FetchJobsListTotal.fulfilled , (state , action) => {
            state.totalCount.data = action.payload;
            state.totalCount.status = 'succcess';
        })
        .addCase(FetchJobsListTotal.rejected , (state) => {
            state.totalCount.data = 0;
            state.totalCount.status = 'failed';
        })
    }
})

export default JobApiListSlice.reducer;







