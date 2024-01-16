import { GlobalSettings } from '../global_settings.js';

document.getElementById("changeInformation").addEventListener("click", login)

function login() {
    const changeInformationDTO = {
        nickname: document.getElementById('nickname').value,
        status: document.getElementById('status').value,
    };

    const token = localStorage.getItem('token')

    fetch(GlobalSettings.apiUrl+'/users', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(changeInformationDTO)
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