import { GlobalSettings } from '../global_settings.js';

document.getElementById("loginButton").addEventListener("click", login)

function login() {
    const userLoginDTO = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    fetch(GlobalSettings.apiUrl+'/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLoginDTO)
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