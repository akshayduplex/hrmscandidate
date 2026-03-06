import moment from 'moment';


export const DateConverts = (date) => {
    if(!date){
        return '';
    }
    return moment(date).format('DD/MM/YYYY');
}

export const camelCaseHandle = (str) => {
    if (!str) {
        return '';
    }
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase());
};

export const changeJobType = (JobTypes) => {

    switch(JobTypes){
        case 'OnContract':
          return  'On Consultant'
        case 'On Contract':
          return  'On Consultant'
        case 'OnRole':
           return  'On Role'
        case 'On Role':
           return  'On Role'
        case 'onRole':
            return  'On Role'
        default:
            return JobTypes
    }
}

export const MonthlySalary = (salary) => {
    if(!salary){
        return 0;
    }
    let maunth = parseInt(salary) / 12
    if(maunth){
        return parseInt(maunth);
    }else {
        return 0;
    }
}