import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter, useLocation, Navigate } from "react-router-dom";
import JobListing from "./job-portal/JobListing";
import JobDetails from "./job-portal/JobDetails";
import ApplyNow from "./job-portal/Applynow";
import JobNavbar from "./job-portal/JobNav";

/************** Candidate Profile To Add the Login Page *************/
import Login from "./candidate_portal/src/Login";
// import Welcome from "./candidate_portal/src/components/Welcome";
import Knowhlfppt from "./candidate_portal/src/components/Know_hlfppt";
import Assessment from "./candidate_portal/src/components/Assessment";
import AssessmentScore from "./candidate_portal/src/components/Assessment_score";
import Profile from "./candidate_portal/src/components/Profile";
import UploadDocument from "./candidate_portal/src/components/Upload_documents";
import YourDocument from "./candidate_portal/src/components/Your_documents";
import MyComponent from "./candidate_portal/src/components/My_components";
import { ProtectedRoute } from "./candidate_portal/src/helper/Auth_Helper";
// import { Verifiedd } from "./components/Verify";
import Urlvarify from './candidate_portal/src/components/Urlverify';
// import config from "./Config/Config";
import JobFooter from "./job-portal/Footers.js/Footers";
import { useDispatch, useSelector } from "react-redux";
import { ConfigrationSetting } from "./Redux/Slices/JobListApi";
import config from "./Config/Config";
import PrivacyPolicy from "./job-portal/PrivacyPolicyPage/PrivacyOrPolicy";
import VerifiedDocument from "./candidate_portal/src/components/VerifyDocument";
import ApplicationForm from "./candidate_portal/src/components/BlankApplicationForm/BlackApplicationForm";
import CandidatePanel from "./candidate_portal/src/components/CandidatePanel";
// import ReferenceCheckForm from "./job-portal/ReferalApproval/ReferealApprovalForm";


const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const showNavbar =
    path === "/" ||
    path === "/job-listing" ||
    path.startsWith("/job-details/") ||
    path.startsWith("/apply/");

  return (
    <>
      {showNavbar ? <JobNavbar /> :
        path !== '/login' && path !== '/verify' && path !== '/privacy-policy' && path !== '/terms-conditions' && path !== '/referenceCheck' && <MyComponent />
      }
      {children}
    </>
  );
};

// make Dynamic Footer Data 
const Footer = () => {
  const location = useLocation();
  const noFooterRoutes = ["/login", '/dashboard', '/candidate_panel', '/assessment', '/verify', '/referenceCheck', '/know-organization', '/assessment-score', '/profile', '/upload-documents', '/your-document', '/approval-documents', '/application-form'];

  return !noFooterRoutes.includes(location.pathname) && <JobFooter />
}

function App() {

  const dispatch = useDispatch()
  const webSetting = useSelector(state => state.jobs.webSettingData);

  useEffect(() => {
    dispatch(ConfigrationSetting({ domain: config.FRONT_URL }))
  }, [dispatch])


  // Manages Web Fab Icons Setting Using the Rile URL
  const changeFavicon = (newFavicon) => {
    const link = document.querySelector("link[rel*='icon']");
    if (link) {
      link.href = config.IMAGE_PATH + newFavicon;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = newFavicon;
      document.head.appendChild(newLink);
    }
  };

  useEffect(() => {
    if (webSetting && webSetting?.data?.fav_icon_image) {
      changeFavicon(webSetting?.data?.fav_icon_image);
    }
  }, [webSetting]);

  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Routes with Navbar */}
            <Route path="/" element={<JobListing />} />
            <Route path="/job-listing" element={<JobListing />} />
            <Route path="/job-details/:id" element={<JobDetails />} />
            <Route path="/apply/:id" element={<ApplyNow />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<PrivacyPolicy />} />

            {/* Routes without Navbar */}
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/verify' element={<Urlvarify />} />
            {/* <Route exact path='/referenceCheck' element={<ReferenceCheckForm />} /> */}
            {/* <Route exact path='/dashboard' element={<ProtectedRoute><Welcome /></ProtectedRoute>} /> */}
            <Route exact path='/dashboard' element={<ProtectedRoute><CandidatePanel /></ProtectedRoute>} />
            <Route exact path='/know-organization' element={<ProtectedRoute><Knowhlfppt /></ProtectedRoute>} />
            <Route exact path='/assessment' element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route exact path='/assessment-score' element={<ProtectedRoute><AssessmentScore /></ProtectedRoute>} />
            <Route exact path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route exact path='/upload-documents' element={<ProtectedRoute><UploadDocument /></ProtectedRoute>} />
            <Route exact path='/your-document' element={<ProtectedRoute><YourDocument /></ProtectedRoute>} />
            <Route exact path='/approval-documents' element={<ProtectedRoute><VerifiedDocument /></ProtectedRoute>} />
            <Route exact path='/application-form' element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
            {/* <Route exact path='/candidate_panel' element={<ProtectedRoute><CandidatePanel /></ProtectedRoute>} /> */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
