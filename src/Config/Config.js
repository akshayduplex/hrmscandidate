import logo from '../images/logo.png';

// import axios from "axios";
let config = {}
// config['BASE_URL'] = 'http://localhost:3000';
// config['API_URL'] = 'http://localhost:3001/api/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117'; 

// http://localhost:3001/approval-documents

// config['BASE_URL'] = 'https://hrmsapis.dtsmis.in/v1';
// config['FRONT_URL'] = 'https://career.dtsmis.in/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
// config['IMAGE_PATH'] = 'https://hrmsapis.dtsmis.in/public/uploads/';
// config['duplex_build']='yes';



config['BASE_URL'] = 'https://hrmsapis.dtsmis.in/v1';
config['API_URL'] = 'https://hrmsapis.dtsmis.in/v1/admin/';
let IS_S3_ENABLED = 'NO';

config['BASE_URL'] = 'http://localhost:8080/v1';
config['API_URL'] = 'http://localhost:8080/v1/candidate/';
config['IMAGE_PATH'] = IS_S3_ENABLED === 'YES'
    ? 'https://e-sangrah-test.s3.eu-north-1.amazonaws.com/uploads/'
    : 'http://localhost:8080/public/uploads/';

// config['IMAGE_PATH'] = 'https://hrapi.hlfppt.org/public/uploads/';
config['FRONT_URL'] = 'https://jobs.hlfppt.org/';
config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
config['duplex_build'] = 'no';


// Live config
// config['BASE_URL'] = 'https://hrapi.hlfppt.org/v1';
// config['IMAGE_PATH'] = 'https://hrapi.hlfppt.org/public/uploads/';
// config['FRONT_URL'] = 'https://jobs.hlfppt.org/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
// config['duplex_build'] = 'no';

config['LOGO_PATH'] = logo;
config['COMPANY_NAME'] = 'HRMS WEB APP';  
config['PANEL_NAME'] = 'HRMS Login';
config['HELP_URL'] = 'support';
config['PRIVACY_URL'] = 'pivacy-policy';
config['TERMS_URL'] = 'terms-conditions';


// // // config['LOGO_PATH'] = logo;
// config['COMPANY_NAME'] = 'HRMS WEB APP';  
// config['PANEL_NAME'] = 'HRMS Login';
// config['HELP_URL'] = 'support';
// config['PRIVACY_URL'] = 'pivacy-policy';
// config['TERMS_URL'] = 'terms-conditions';

// Duplex Fron URL
// config['FRONT_URL'] = 'https://career.duplextech.com';
// config['BASE_URL'] = 'https://hrapi.duplextech.com/v1';
// config['API_URL'] = 'https://hrapi.duplextech.com/v1/candidate/';
// config['GLOB_API_URL'] = 'https://hrapi.duplextech.com/v1/global/';
// config['IMAGE_PATH'] = 'https://hrapi.duplextech.com/public/uploads/';
// config['API_TOKEN'] = 'Bearer 744b365cde7bd714a928d5a04167a117';
// config['FRONT_URL'] = ' https://career.duplextech.com';
// config['COMPANY_NAME'] = 'Duplex Technologies Services Pvt. Ltd ';  
// config['PANEL_NAME'] = 'Candidate Login';
// config['HELP_URL'] = 'https://duplextech.com/contact-us.html';
// config['PRIVACY_URL'] = 'https://duplextech.com/privacy-policy.html';
// config['TERMS_URL'] = 'https://duplextech.com/terms-and-conditions.html';
// config['duplex_build']='yes';

export default config;



