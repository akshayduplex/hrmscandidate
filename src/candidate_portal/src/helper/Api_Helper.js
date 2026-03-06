import config from "../config/Config";
import axios from 'axios';
import { apiHeaderToken, apiHeaderTokenMultiPart } from "./My_Helper";

let APIURL = config.API_URL;
let GLOB_API_URL = config.GLOB_API_URL;

const handleError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 403:
        throw new Error( error.response?.data?.message || 'Access forbidden: You do not have permission to access this resource.');
      // Add other status code cases if needed
      default:
        throw new Error(`Error: ${error.response.status} - ${error.response.statusText}`);
    }
  } else {
    throw new Error('Network Error');
  }
};

const loginWithEmail = async (postData) => {
  try {
    const response = await axios.post(`${APIURL}loginWithEmail`, postData);
    return response.data;
  } catch (error) {
    console.error('Error logging in with email', error);
    handleError(error);
  }
};

const verifyLoginOtp = async (postData) => {
  try {
    const response = await axios.post(`${APIURL}verifyLoginOtp`, postData);
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP', error);
    handleError(error);
  }
};

const getLocationList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${GLOB_API_URL}getLocationList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active"
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching location list', error);
    handleError(error);
  }
};

const getDesignationList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${GLOB_API_URL}getDesignationList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active"
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching location list', error);
    handleError(error);
  }
};

const getEducationList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${GLOB_API_URL}getEducationList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active"
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching education list', error);
    handleError(error);
  }
};

const getAppliedFromList = async (searchKey) => {
  try {
    const response = await axios.post(
      `${APIURL}getAppliedFromList`,
      {
        keyword: searchKey,
        page_no: "1",
        per_page_record: "25",
        scope_fields: ["_id", "name"],
        status: "Active"
      },
      apiHeaderToken()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching education list', error);
    handleError(error);
  }
};

const editProfile = async (postData) => {
  try {
    const response = await axios.post(`${APIURL}editProfile`, postData, apiHeaderTokenMultiPart());
    return response.data;
  } catch (error) {
    console.error('Error editing profile', error);
    handleError(error);
  }
};

const getCandidateById = async (postData) => {
  try {

    const response = await axios.post(`${APIURL}getCandidateById`, postData, apiHeaderToken());
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate by ID', error);
    handleError(error);
  }
};

const uploadKycDocs = async (postData) => {
  try {
    const response = await axios.post(`${APIURL}uploadKycDocs`, postData, apiHeaderTokenMultiPart());
    return response.data;
  } catch (error) {
    console.error('Error uploading KYC docs', error);
    handleError(error);
  }
};


const updateFinalDocumentStatus = async (postData) => {
  try {
    const response = await axios.post(`${APIURL}updateFinalDocumentStatus`, postData, apiHeaderToken());
    return response.data;
  } catch (error) {
    console.log('no')
    console.error('Error fetching single assessment', error);
    handleError(error);
  }
};
const getSingleAssessment = async (postData) => {
  try {
    const response = await axios.post(`${APIURL}getSingleAssessment`, postData, apiHeaderToken());
    return response.data;
  } catch (error) {
    console.error('Error fetching single assessment', error);
    handleError(error);
  }
};

const checkAssessment = async (postData) => {
  try {
    const response = await axios.post(`${APIURL}checkAssessment`, postData, apiHeaderToken());
    return response.data;
  } catch (error) {
    console.error('Error checking assessment', error);
    console.log(error);
    handleError(error);
  }
};

const verifyOffer = async (postData) => {
  try {
    const response = await axios.post(`${APIURL}verifyOffer`, postData, apiHeaderToken());
    return response.data;
  } catch (error) {
    console.error('Error checking assessment', error);
    handleError(error);
  }
};

const uploadResume = async (postData) => {
  try {
    const response = await axios.post(`${APIURL}uploadResume`, postData, apiHeaderTokenMultiPart());
    return response.data;
  } catch (error) {
    console.error('Error uploading KYC docs', error);
    handleError(error);
  }
};

export {
  loginWithEmail,
  verifyLoginOtp,
  getLocationList,
  getDesignationList,
  getEducationList,
  getAppliedFromList,
  getCandidateById,
  editProfile,
  uploadKycDocs,
  getSingleAssessment,
  checkAssessment,
  uploadResume,
  updateFinalDocumentStatus,
  verifyOffer
};
