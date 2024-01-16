import { GlobalSettings } from '../global_settings.js';

document.getElementById("subscribeButton").addEventListener("click", subscribe)

function subscribe() {
    const subscriptionCreateRequestDTO = {
        following: document.getElementById('username').value,
    };
    const token = localStorage.getItem('token')

    fetch(GlobalSettings.apiUrl+'/subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(subscriptionCreateRequestDTO)
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