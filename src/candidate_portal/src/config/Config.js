// import axios from "axios";
let config = {}; // Initialize as an empty object

// config['BASE_URL'] = 'https://hrmsapis.dtsmis.in/';
// config['API_URL'] = 'https://hrmsapis.dtsmis.in/v1/candidate/';
// config['GLOB_API_URL'] = 'https://hrmsapis.dtsmis.in/v1/global/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
// config['IMAGE_PATH'] = 'https://hrmsapis.dtsmis.in/public/uploads/';
// config['FRONT_URL'] = 'https://career.dtsmis.in/';

let IS_S3_ENABLED = 'NO';

config['BASE_URL'] = 'http://localhost:8080/v1';
config['API_URL'] = 'http://localhost:8080/v1/candidate/';
config['IMAGE_PATH'] = IS_S3_ENABLED === 'YES'
    ? 'https://e-sangrah-test.s3.eu-north-1.amazonaws.com/uploads/'
    : 'http://localhost:8080/public/uploads/';

config['IMAGE_PATH_EMP'] = IS_S3_ENABLED === 'YES'
    ? 'https://e-sangrah-test.s3.eu-north-1.amazonaws.com/emp_uploads/'
    : 'http://localhost:8080/public/emp_uploads/';
// // config['IMAGE_PATH'] = 'https://hrmsapis.dtsmis.in/public/uploads/';
// config['FRONT_URL'] = 'https://jobs.hlfppt.org/';
// config['GLOB_API_URL'] = 'https://api-hrms.dtsmis.in:3008/v1/global/';
// // config['GLOB_API_URL'] = 'https://api-hrms.dtsmis.in:3008/v1/global/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';


// config['BASE_URL'] = 'https://hrapi.duplextech.com/v1';
// config['API_URL'] = 'https://hrapi.duplextech.com/v1/candidate/';
// config['GLOB_API_URL'] = 'https://hrapi.duplextech.com/v1/global/';
// config['IMAGE_PATH'] = 'https://hrapi.duplextech.com/public/uploads/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
// config['FRONT_URL'] = 'https://career.duplextech.com/';

/**
 * Live config
 */
// config['BASE_URL'] = 'https://hrapi.hlfppt.org/';
// config['API_URL'] = 'https://hrapi.hlfppt.org/v1/candidate/';
// config['GLOB_API_URL'] = 'https://hrapi.hlfppt.org/v1/global/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
// config['IMAGE_PATH'] = 'https://hrapi.hlfppt.org/public/uploads/';
// config['FRONT_URL'] = 'https://jobs.hlfppt.org/';


// // config['LOGO_PATH'] = logo;
config['COMPANY_NAME'] = 'HRMS WEB APP';  
config['PANEL_NAME'] = 'HRMS Login';
config['HELP_URL'] = 'support';
config['PRIVACY_URL'] = 'pivacy-policy';
config['TERMS_URL'] = 'terms-conditions';

/**
 * this is old script don't we use to the further config
 */
// config['BASE_URL'] = 'https://syshrms.duplextech.com/';
// config['API_URL'] = ' https://hrapi.duplextech.com/v1/employee/';
// config['GLOB_API_URL'] = 'https://hrapi.duplextech.com/v1/global/';
// config['IMAGE_PATH'] = 'https://hrapi.duplextech.com/public/uploads/';
// config['CANDIDATE_URL'] = 'https://hrapi.duplextech.com/v1/candidate/';
// config['FRONT_URL'] = 'https://career.duplextech.com/';


// https://career.duplextech.com


config['SESSIONKEY'] = 'loginData';

export default config;



// config['LOGO_PATH'] = logo;

// config['COMPANY_NAME'] = 'HRMS WEB APP';
// config['PANEL_NAME'] = 'HRMS Login';
// config['HELP_URL'] = 'support';
// config['PRIVACY_URL'] = 'pivacy-policy';
// config['TERMS_URL'] = 'terms-conditions';
