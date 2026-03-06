import React, { useState } from 'react';

function SkillDocs() {
    const [fileFields, setFileFields] = useState([{ id: 0, file: null }]);

    // Function to handle adding a new file input field
    const handleAddFileField = () => {
        setFileFields([...fileFields, { id: fileFields.length, file: null }]);
    };

    // Function to handle removing a file input field
    const handleRemoveFileField = (id) => {
        setFileFields(fileFields.filter((field) => field.id !== id));
    };

    // Function to handle selecting a file
    const handleFileChange = (event, id) => {
        const selectedFile = event.target.files[0];
        const updatedFields = fileFields.map((field) => {
            if (field.id === id) {
                return { ...field, file: selectedFile };
            }
            return field;
        });
        setFileFields(updatedFields);
    };

    return (
        <div className='d-flex align-items-center gap-4 flex-wrap'>
            {fileFields.map((field) => (
                <div className='d-flex align-items-center gap-4 certify_btn' key={field.id}>
                    <input className='cstmfile' type="file" onChange={(event) => handleFileChange(event, field.id)} />
                    <button className="subtbtn" onClick={() => handleRemoveFileField(field.id)}>-</button>
                </div>
            ))}
            <button className='addbtn' onClick={handleAddFileField}>+</button>
        </div>
    );
}


export default SkillDocs;