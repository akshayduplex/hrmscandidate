
import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useDispatch } from 'react-redux';
import { fetchCitySuggestions } from '../../Redux/Slices/JobListApi';
const CustomAsyncSelectField = ({ field, form, isInvalid , isApplied = false}) => {
    const dispatch = useDispatch();
    const [option, setOption] = useState([]);

    const loadDefaultOptions = async () => {
        const result = await dispatch(fetchCitySuggestions('')).unwrap();
        setOption(result);
    };

    const loadOptions = async (inputValue) => {
        const result = await dispatch(fetchCitySuggestions(inputValue)).unwrap();
        return result;
    };


    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#fff',
            borderColor: state.isFocused
                ? (isInvalid ? 'red' : '#D2C9FF')
                : state.isHovered
                ? (isInvalid ? 'red' : '#80CBC4')
                : isInvalid
                ? 'red'
                : provided.borderColor,
            boxShadow: state.isFocused
                ? (isInvalid ? '0 0 0 1px red' : '0 0 0 1px #D2C9FF')
                : 'none',
            '&:hover': {
                borderColor: isInvalid ? 'red' : '#D2C9FF',
            },
            width: isApplied ? '100%' : '230px',
            height: '42px',
        }),
        menu: (provided) => ({
            ...provided,
            borderTop: '1px solid #D2C9FF',
            zIndex: '9',
        }),
        option: (provided, state) => ({
            ...provided,
            borderBottom: '1px solid #D2C9FF',
            color: state.isSelected ? '#fff' : '#000',
            backgroundColor: state.isSelected
                ? '#4CAF50'
                : state.isFocused
                ? '#80CBC4'
                : provided.backgroundColor,
            '&:hover': {
                backgroundColor: '#80CBC4',
                color: '#fff',
            },
        }),
    };
    

    return (
        <AsyncSelect
            loadOptions={loadOptions}
            defaultOptions
            defaultValue={option}
            onMenuOpen={loadDefaultOptions}
            name={field.name}
            value={field.value ? { value: field.value, label: field.value } : null}
            onChange={(option) => form.setFieldValue(field.name, option.value)}
            onBlur={field.onBlur}
            classNamePrefix="react-select"
            styles={selectStyles}
            placeholder='Type Location...'
        />
    );
};

export default CustomAsyncSelectField;




// import React, { useState, useCallback } from 'react';
// import AsyncSelect from 'react-select/async';
// import { useDispatch } from 'react-redux';
// import { fetchCitySuggestions } from '../../Redux/Slices/JobListApi';
// import debounce from 'lodash/debounce';

// const CustomAsyncSelectField = ({ field, form, isInvalid }) => {
//     const dispatch = useDispatch();
//     const [option, setOption] = useState([]);

//     const loadDefaultOptions = async () => {
//         const result = await dispatch(fetchCitySuggestions('')).unwrap();
//         setOption(result);
//     };

//     const loadOptions = async (inputValue) => {
//         const result = await dispatch(fetchCitySuggestions(inputValue)).unwrap();
//         return result;
//     };

//     const debouncedLoadOptions = useCallback(
//         debounce(loadOptions, 500), 
//         []
//     );

//     const selectStyles = {
//         control: (provided, state) => ({
//             ...provided,
//             backgroundColor: '#fff',
//             borderColor: state.isFocused
//                 ? (isInvalid ? 'red' : '#D2C9FF')
//                 : state.isHovered
//                 ? (isInvalid ? 'red' : '#80CBC4')
//                 : isInvalid
//                 ? 'red'
//                 : provided.borderColor,
//             boxShadow: state.isFocused
//                 ? (isInvalid ? '0 0 0 1px red' : '0 0 0 1px #D2C9FF')
//                 : 'none',
//             '&:hover': {
//                 borderColor: isInvalid ? 'red' : '#D2C9FF',
//             },
//             width: '100%',
//             height: '44px',
//         }),
//         menu: (provided) => ({
//             ...provided,
//             borderTop: '1px solid #D2C9FF',
//             zIndex: '9',
//         }),
//         option: (provided, state) => ({
//             ...provided,
//             borderBottom: '1px solid #D2C9FF',
//             color: state.isSelected ? '#fff' : '#000',
//             backgroundColor: state.isSelected
//                 ? '#4CAF50'
//                 : state.isFocused
//                 ? '#80CBC4'
//                 : provided.backgroundColor,
//             '&:hover': {
//                 backgroundColor: '#80CBC4',
//                 color: '#fff',
//             },
//         }),
//     };

//     return (
//         <AsyncSelect
//             loadOptions={debouncedLoadOptions}
//             //defaultOptions
//             defaultOptions={option}
//             onMenuOpen={loadDefaultOptions}
//             name={field.name}
//             value={field.value ? { value: field.value, label: field.value } : null}
//             onChange={(option) => form.setFieldValue(field.name, option.value)}
//             onBlur={field.onBlur}
//             classNamePrefix="react-select"
//             styles={selectStyles}
//             placeholder='Type Location...'
//         />
//     );
// };

// export default CustomAsyncSelectField;
