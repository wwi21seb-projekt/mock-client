import { GlobalSettings } from '../global_settings.js';

document.getElementById("refreshTokenButton").addEventListener("click", refreshToken)

function refreshToken() {
    refreshToken = localStorage.getItem('refreshToken') // get refresh token from local storage

    if(refreshToken === null) {
        document.getElementById('response').innerHTML = '<strong>Status Code:</strong> ' + 'xx' + '<br>' +
        '<pre>' + JSON.stringify("No refresh token saved", null, 2) + '</pre>';
        return
    }

    const refreshRequestDTO = {
        refreshToken: refreshToken,
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