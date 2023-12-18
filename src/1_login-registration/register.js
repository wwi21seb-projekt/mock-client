import { GlobalSettings } from '../global_settings.js';

document.getElementById("createUserButton").addEventListener("click", createUser)

function createUser() {
    const userRegistrationDTO = {
        username: document.getElementById('username').value,
        nickname: document.getElementById('nickname').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value
    };

    fetch(GlobalSettings.apiUrl+  '/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userRegistrationDTO)
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