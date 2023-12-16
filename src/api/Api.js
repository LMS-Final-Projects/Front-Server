import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

export const api = async (url, method, data) => {
    const body = await axios({
        url,
        method,
        data,
        withCredentials: true
    });
    return body.data;
};

export const exceptionApi = async (url, method, data) => {
    const body = await axios({
        url,
        method,
        data,
        withCredentials: true
    });

    if (body.data.code !== 'OK') {
        alert(body.data.errorMsg);
        return '';
    }

    return body.data;
};

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            handle401Error(error);
        }
        return Promise.reject(error); //
    }
);

const handle401Error = (error) => {
    if (error.response.data === "Unauthorized: Expired JWT token") {
        window.location.href = '/reissue';
    } else {
        window.location.href = '/';
    }
};







