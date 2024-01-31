import { GlobalSettings } from '../global_settings.js';

document.getElementById("refreshTokenButton").addEventListener("click", refreshToken)

function refreshToken() {
    const refreshRequestDTO = {
        refreshToken: document.getElementById('refreshToken').value,
    };

    fetch(GlobalSettings.apiUrl+'/users/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(refreshRequestDTO)
    })
        .then(response => {
            return response.json().then(json => ({
                status: response.status,
                json
            }));
        })
        .then(({ status, json }) => {
            document.getElementById('response').innerHTML =
                '<strong>Status Code:</strong> ' + status + '<br>' +
                '<pre>' + JSON.stringify(json, null, 2) + '</pre>';

            if (status === 200) {
                localStorage.setItem('token', json.token); // store token in local storage
            }
        })
        .catch(error => console.error('Error:', error));
}