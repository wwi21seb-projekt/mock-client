import { GlobalSettings } from '../global_settings.js';

document.getElementById("resendTokenButton").addEventListener("click", resendToken)

function resendToken() {

    const username = document.getElementById('username').value

    fetch(GlobalSettings.apiUrl+ '/users/'+username+'/activate', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: null
    })
        .then(response => {
            if (response.status === 204) {
                return {status: response.status, json: {}};
            } else {
                return response.json().then(json => ({
                    status: response.status,
                    json
                }));
            }
        })
        .then(({ status, json }) => {
            document.getElementById('response').innerHTML =
                '<strong>Status Code:</strong> ' + status + '<br>' +
                '<pre>' + JSON.stringify(json, null, 2) + '</pre>';
        })
        .catch(error => console.error('Error:', error));

}