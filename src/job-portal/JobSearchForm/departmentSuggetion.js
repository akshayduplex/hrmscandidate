import React,{useState} from 'react';
import AsyncSelect from 'react-select/async';
import { useDispatch } from 'react-redux';
import { DepartmentSuggestions } from '../../Redux/Slices/JobListApi';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
    '&:hover': {
      borderColor: '#D2C9FF',
    },
    maxWidth: '12rem',
    width: '12rem',
    height: '44px',
    // borderTopLeftRadius: '0',
    // borderBottomLeftRadius: '0',
  }),
  menu: (provided) => ({
    ...provided,
    borderTop: '1px solid #D2C9FF',
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #D2C9FF',
    color: state.isSelected ? '#fff' : '#000',
    backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
    '&:hover': {
      backgroundColor: '#80CBC4',
      color: '#fff',
    },
  }),
};

const DepartmentSelectField = ({ onChange }) => {
  const dispatch = useDispatch();
  const [option , setOption] = useState([]);

  const loadDefaultOptions = async () => {
    const result = await dispatch(DepartmentSuggestions('')).unwrap();
    setOption(result);
  };

  const loadOptions = async (inputValue) => {
    const result = await dispatch(DepartmentSuggestions(inputValue)).unwrap();
    return result;
  };

  
  return (
    <AsyncSelect
      defaultOptions
      defaultValue={option}
      onMenuOpen={loadDefaultOptions}
      loadOptions={loadOptions}
      placeholder='Designation...'
      onChange={(option) => onChange(option.value)}
      classNamePrefix="react-select"
      styles={customStyles}
    />
  );
};

export default DepartmentSelectField;



// import React, { useState, useCallback } from 'react';
// import AsyncSelect from 'react-select/async';
// import { useDispatch } from 'react-redux';
// import { DepartmentSuggestions } from '../../Redux/Slices/JobListApi';
// import debounce from 'lodash.debounce';

// const customStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     backgroundColor: '#fff',
//     borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
//     boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
//     '&:hover': {
//       borderColor: '#D2C9FF',
//     },
//     maxWidth: '12rem',
//     width: '12rem',
//     height: '44px',
//   }),
//   menu: (provided) => ({
//     ...provided,
//     borderTop: '1px solid #D2C9FF',
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     borderBottom: '1px solid #D2C9FF',
//     color: state.isSelected ? '#fff' : '#000',
//     backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
//     '&:hover': {
//       backgroundColor: '#80CBC4',
//       color: '#fff',
//     },
//   }),
// };

// const DepartmentSelectField = ({ onChange }) => {
//   const dispatch = useDispatch();
//   const [option, setOption] = useState([]);

//   const loadDefaultOptions = async () => {
//     const result = await dispatch(DepartmentSuggestions('')).unwrap();
//     setOption(result);
//   };

//   const fetchOptions = async (inputValue) => {
//     const result = await dispatch(DepartmentSuggestions(inputValue)).unwrap();
//     return result;
//   };

//   // Debounce the fetchOptions function
//   const loadOptions = useCallback(debounce(fetchOptions, 500), []);

//   return (
//     <AsyncSelect
      
//     defaultOptions={option}
//       onMenuOpen={loadDefaultOptions}
//       loadOptions={loadOptions}
//       placeholder='Designation...'
//       onChange={(option) => onChange(option.value)}
//       classNamePrefix="react-select"
//       styles={customStyles}
//     />
//   );
// };

// export default DepartmentSelectField;
