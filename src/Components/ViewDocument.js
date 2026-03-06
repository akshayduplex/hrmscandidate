import React from "react";
import Aadhar from "../images/adhaar.jpg";
import Modal from 'react-bootstrap/Modal';

const ViewDocModal = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Your Document
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                <div className="col-sm-12">
                    <div className="uplaodrow my-4">
                        <img src={Aadhar} alt=""/>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}


export default ViewDocModal;
