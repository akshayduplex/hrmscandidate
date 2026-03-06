import React from "react";
import Modal from 'react-bootstrap/Modal';
import config from "../config/Config";
const IMAGE_PATH = config.IMAGE_PATH
const Viewdoc_modal = ({ document, ...props }) => {
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
                        {document ? (
                            <>
                                <img src={IMAGE_PATH+document.file_name} alt={document.doc_name} style={{ width: '100%' }} />
                                {/* <p>{document.doc_name}</p>
                                <p>{document.mime_type.toUpperCase()}</p>
                                <p>{document.file_size}</p>
                                <p>{new Date(document.add_date).toLocaleDateString()}</p> */}
                            </>
                        ) : (
                            <p>No document selected.</p>
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Viewdoc_modal;
