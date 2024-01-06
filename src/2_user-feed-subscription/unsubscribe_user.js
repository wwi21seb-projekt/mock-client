import { GlobalSettings } from '../global_settings.js';

document.getElementById("unsubscribeButton").addEventListener("click", unsubscribe)

function unsubscribe() {
    const subscriptionId = document.getElementById('subscriptionId').value;
    const token = localStorage.getItem('token')

    const url = GlobalSettings.apiUrl+'/subscription/' + subscriptionId

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
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