import { GlobalSettings } from '../global_settings.js';

document.getElementById("changePassword").addEventListener("click", login)

function login() {
    const changePasswordDTO = {
        oldPassword: document.getElementById('oldPassword').value,
        newPassword: document.getElementById('newPassword').value,
    };

    const token = localStorage.getItem('token')

    fetch(GlobalSettings.apiUrl+'/users', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(changePasswordDTO)
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
        })
        .catch(error => console.error('Error:', error));
}