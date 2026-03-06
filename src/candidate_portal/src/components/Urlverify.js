import React, { useState, useEffect } from "react";
import AcceptIMG from "../images/accept.png";
import RejectIMG from "../images/reject.png";
import LoaderIMG from "../images/loading.webp"; // Ensure correct image path
import config from "../config/Config";

import { verifyOffer } from "../helper/Api_Helper";
import axios from "axios";
import { apiHeaderToken } from "../../../Headers/CustomeHeaders";
import { Button, Spinner } from "react-bootstrap"; // Replace this line
// import { Button, Row, Spinner } from "react-bootstrap";
import { Row } from "react-bootstrap";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setSessiontData } from "../helper/My_Helper";
import { useNavigate } from "react-router-dom";

// import { Form } from "react-router-dom";

const Urlvarify = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const [CandidateData, setCandidateData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [PendingOffer, setPending] = useState(false);
  const [formData, setFormData] = useState({
    candidate_name: '',
    designation: '',
    joining_date: '',
    inductiveJoiningDate: '',
    offeredCtc: '',
    utm: '',
    type: '',
  })


  const handleStateChange = (obj) => {
    setFormData((prev) => ({
      ...prev,
      ...obj
    }));
  };


  const style = {
    padding: '30px',
    borderRadius: '5px',
    // width: '50%',
    margin: '0px auto',
    textAlign: 'center',
  };


  const handleGetCandidateDetails = async (id, accessToken) => {

    try {
      let Payloads = {
        "_id": id,
        "scope_fields": []
      }
      let response = await axios.post(`${config.API_URL}getCandidateById`, Payloads, apiHeaderToken(accessToken))
      if (response.status === 200) {
        setCandidateData(response.data)
        let CandidateDetails = response.data?.data;
        if (CandidateDetails?.applied_jobs?.find((item) => item.job_id === CandidateDetails?.job_id)?.offer_status === 'Accepted') {
          setShowAccept(true);
        } else if (CandidateDetails?.applied_jobs?.find((item) => item.job_id === CandidateDetails?.job_id)?.offer_status === 'Rejected') {
          setShowReject(true);
        } else {
          setPending(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (offerDetails) {
      let [candidateId, appliedJonId, accessToken] = offerDetails;
      console.log(appliedJonId, 'this is Applied Job Details Id');
      if (candidateId) {
        handleGetCandidateDetails(candidateId, accessToken)
      }
    }
  }, [offerDetails])

  // let loading = false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current URL
        const url = new URL(window.location.href);
        // Get query parameters
        const queryParams = new URLSearchParams(url.search);
        // Retrieve individual parameters
        const utm = queryParams.get('utm');
        const type = queryParams.get('type');

        handleStateChange({ utm: utm, type: type })

        try {
          const data = atob(utm);
          if (data && typeof data !== 'undefined') {
            setOfferDetails(data?.split('|'))
          }
        } catch (error) {
          console.error("Error decoding Base64 string:", error);
        }
        // Call API with parameters
        if (type === 'reject') {
          const response = await verifyOffer({ utm, type });
          if (response.status && response.data === 'rejected') {
            setShowReject(true);
            setPending(false)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setShowReject(true); // Show reject case if there’s an error
      } finally {
        setIsLoading(false); // Ensure loading state is updated
      }
    };
    fetchData();
  }, []);

  const validateTheOffer = async () => {

      if (!formData.inductiveJoiningDate) {
        toast.warn("Please Select the Tentative Date")
        return
      }
      setLoading(true);
      const response = await verifyOffer({ utm: formData.utm, type: formData.type, tentative_date: formData.inductiveJoiningDate });
      if (response.status && response.data === 'accepted') {
        setShowAccept(true);
        setPending(false)
        setSessiontData('loginData', CandidateData?.data);
        setTimeout(() => {
          navigate("/approval-documents");
        }, 2000);
      } else {
        toast.warn(response?.message)
      }
      setTimeout(() => {
        setLoading(false)
      }, 1000);
  }

  return (

    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="dark"
        limit={1}
      />
      <div className="verifiedPg" style={style}>
        {isLoading ? (
          <div className="loadercase">
            <img src={LoaderIMG} alt="Loading" />
            <p style={{ fontSize: "22px", fontWeight: 500, marginBottom: "20px" }}>
              Please Wait...
            </p>
          </div>
        ) : (
          <>
            {showAccept && (
              <div className="acceptcase">
                <img src={AcceptIMG} alt="Accept" />
                <p style={{ fontSize: "22px", fontWeight: 500, marginBottom: "20px" }}>
                  Thank you for accepting the offer. Welcome to HLFPPT!
                </p>
                <p style={{ fontSize: "19px", fontWeight: 400 }}>
                  You can expect the appointment letter from us shortly.
                </p>
              </div>
            )}

            {showReject && (
              <div className="rejectcase">
                <img src={RejectIMG} alt="Reject" />
                <p style={{ fontSize: "22px", fontWeight: 500, marginBottom: "20px" }}>
                  Thank you
                </p>
                <p style={{ fontSize: "19px", fontWeight: 400 }}>
                  Despite your decision not to be with us onboard, we thank you for
                  taking the time to speak with us about the job opportunity. It was a
                  pleasure meeting with you.
                </p>
              </div>
            )}

            {
              PendingOffer &&
              (
                <div className="container">
                  <div className='row'>
                    <div className='sitecard'>
                      <div className='d-flex justify-content-center align-content-center mt-3 mb-5'>
                        <div className=''>
                          <img
                            src="/logo512.png"
                            alt="logo"
                          />
                        </div>
                      </div>
                      <Row>
                        <div className="col-sm-4 manpwr_data_colm">
                          <h6>Name</h6>
                          <p>{CandidateData && CandidateData?.data?.name}</p>
                        </div>
                        <div className="col-sm-4 manpwr_data_colm">
                          <h6>Date Of Joining</h6>
                          <p>{CandidateData && moment(CandidateData?.data?.applied_jobs.find((item) => item.job_id === CandidateData?.data?.job_id)?.onboard_date).format('DD/MM/YYYY')}</p>
                        </div>
                        <div className="col-sm-4 manpwr_data_colm">
                          <h6>Designation</h6>
                          <p>{CandidateData?.data?.designation}</p>
                        </div>
                        <div className="col-sm-4 manpwr_data_colm">
                          <h6>Offered CTC</h6>
                          <p>{CandidateData && CandidateData?.data?.applied_jobs.find((item) => item.job_id === CandidateData?.data?.job_id)?.offer_ctc}</p>
                        </div>
                        <div className="col-sm-4 manpwr_data_colm">
                          <h6>Tentative Joining Date</h6>
                          <div className='position-relative'>
                            <DatePicker
                              selected={formData.inductiveJoiningDate ? new Date(formData.inductiveJoiningDate) : null}
                              onChange={(date) =>
                                handleStateChange({ inductiveJoiningDate: moment(date).format("YYYY-MM-DD") })
                              }
                              placeholderText="Select Date"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </Row>
                      <Row>
                        {
                          loading ?
                            <div className='m-auto text-center'>
                              <Button type="button" className='btn manpwbtn my-4'><Spinner animation="border" role="status"></Spinner></Button>
                            </div> :
                            <div className='m-auto text-center'>
                              <Button type="button" onClick={validateTheOffer} className='btn manpwbtn my-4'>Accept</Button>
                            </div>
                        }
                      </Row>
                    </div>
                  </div>
                </div>
              )
            }
          </>
        )}
      </div>
    </>
  );
};

export default Urlvarify;
