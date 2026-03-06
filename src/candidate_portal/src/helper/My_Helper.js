import config from "../config/Config";

const apiHeaderToken = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${getToken()}`
    }
  }
}

const apiHeaderTokenMultiPart = () => {
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      'authorization': `Bearer ${getToken()}`
    }
  }
}


const setSessiontData = (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    sessionStorage.setItem(key, jsonData);
  } catch (error) {
    console.error('Error setting session storage item', error);
  }
};

const getSessionData = (key) => {
  try {
    const jsonData = sessionStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error('Error getting session storage item', error);
    return null;
  }
};


const getToken = () => {
  try {

    const jsonData = sessionStorage.getItem('loginData');
    const dataObject = jsonData ? JSON.parse(jsonData) : null;


    console.log(dataObject, 'This is Object Token Data From the Server Here Is are Some OF The Issue Here to T M C');
    return dataObject ? dataObject.token : null;
  } catch (error) {
    console.error('Error getting session storage item', error);
    return null;
  }
};



const getCandidateId = () => {
  try {
    // Retrieve the JSON string from sessionStorage
    const jsonData = sessionStorage.getItem('loginData');

    // Parse the JSON string into an object
    const dataObject = jsonData ? JSON.parse(jsonData) : null;
    // Access properties from the parsed object
    return dataObject ? dataObject._id : null; // Returns the _id if available
  } catch (error) {
    console.error('Error getting session storage item', error);
    return null;
  }
};

const clearSessionData = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing session storage', error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) {
    return ""; // Return an empty string if dateString is empty
  }

  const date = new Date(dateString);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return ""; // Return an empty string for invalid dates
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateWithSuffix = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();

  // Get ordinal suffix
  const getOrdinal = (n) => {
      if (n >= 11 && n <= 13) return "th";
      switch (n % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
      }
  };

  return `${day}${getOrdinal(day)} ${month}, ${year}`;
};

const lettersOnly = (name) => {
  const regex = /^[a-zA-Z]*$/;
  return regex.test(name);
};
// replace(/[^0-9]/g, '')
const numbersOnly = (mobileNo) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(mobileNo);
};

const imgUrl = (name) => {
  // return 'https://api-hrms.dtsmis.in:3008/public/uploads/'+name;
  return config.IMAGE_PATH + name;
};

export { imgUrl, formatDateWithSuffix,apiHeaderToken, apiHeaderTokenMultiPart, setSessiontData, getSessionData, clearSessionData, getCandidateId, formatDate, lettersOnly, numbersOnly };