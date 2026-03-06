import React,{useState} from 'react';
import AsyncSelect from 'react-select/async';
import { useDispatch } from 'react-redux';
import { fetchDesignationSuggestions } from '../../Redux/Slices/JobListApi';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff !important',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        // maxWidth: '%',
        width: '230px',
        height: '42px',
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0'
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};

const DesignationSelectField = ({ field, form }) => {
    const dispatch = useDispatch();
    const [option , setOption] = useState([]);

    const loadDefaultOptions = async () => {
        const result = await dispatch(fetchDesignationSuggestions('')).unwrap();
        setOption(result)
    };

    const loadOptions = async (inputValue) => {
        const result = await dispatch(fetchDesignationSuggestions(inputValue)).unwrap();
        return result;
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
            styles={customStyles}
            placeholder='Type Department...'
        />
    );
};

export default DesignationSelectField;
