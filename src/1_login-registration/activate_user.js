import { GlobalSettings } from '../global_settings.js';

document.getElementById("activateUserButton").addEventListener("click", activateUser)

function activateUser() {

    const username = document.getElementById('username').value

    const userActivationDTO = {
        token: document.getElementById('token').value
    };

    fetch(GlobalSettings.apiUrl+ '/users/'+username+'/activate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userActivationDTO)
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