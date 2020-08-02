import axios from 'axios';

export const refreshToken = () => {
    let headers = {
        refresh_token: sessionStorage.getItem('refreshToken')
    };

    axios.get('http://localhost:8000/refresh_token', { params: headers }).then((response) => {
        //console.log(response.data);

        sessionStorage.setItem('authToken', response.data.access_token);

        window.location.reload();
    });
};