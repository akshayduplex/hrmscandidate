const apiHeaderToken = (token) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `${token}`,
            'referer':'http://localhost:3000'
        }
    }
}

const apiHeaderTokenMultiPart = (token) => {
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            'authorization': `${token}`,
            'referer':'http://localhost:3000'
        }
    }
}


export { apiHeaderToken, apiHeaderTokenMultiPart };


