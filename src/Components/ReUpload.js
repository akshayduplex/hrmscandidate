import React from "react";

import Modal from 'react-bootstrap/Modal';

// function MyVerticallyCenteredModal(props) {
const UploadModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Re-upload Correct Document
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                <div className="col-sm-12">
                    <div className="uplaodrow my-4">
                        <div className="customfile_upload">
                            <input type="file" className="cstmfile" />
                            <span className="filenames">10th Marksheet.jpg</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="button" class="sitebtn mt-4 btn btn-primary"> Submit </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}


export default UploadModal;
