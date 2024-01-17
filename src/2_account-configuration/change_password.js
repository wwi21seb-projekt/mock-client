import { GlobalSettings } from '../global_settings.js';

document.getElementById("changePassword").addEventListener("click", changePassword)

function changePassword() {
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
            if (response.status === 204) {
                return { status: response.status, json: {} };
            } else {
                return response.json().then(json => ({
                    status: response.status,
                    json
                }));
            }
        })
        .then(({ status, json }) => {
            let responseHTML = '<strong>Status Code:</strong> ' + status + '<br>';
            if (status !== 204) {
                responseHTML += '<pre>' + JSON.stringify(json, null, 2) + '</pre>';
            } else {
                responseHTML += 'Password successfully changed.';
            }
            document.getElementById('response').innerHTML = responseHTML;
        })
        .catch(error => console.error('Error:', error));
}