import { GlobalSettings } from '../global_settings.js';

document.getElementById("unsubscribeButton").addEventListener("click", unsubscribe)

function unsubscribe() {
    const subscriptionId = document.getElementById('subscriptionId').value;
    const token = localStorage.getItem('token')

    const url = GlobalSettings.apiUrl+'/subscriptions/' + subscriptionId

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (response.status === 204) {
                document.getElementById('response').innerHTML =
                    '<strong>Status Code:</strong> ' + response.status + '<br>' +
                    '<pre>' + 'Subscription successfully deleted' + '</pre>';
                return null;
            } else {
                return response.json().then(json => ({
                    status: response.status,
                    json
                }));
            }
        })
        .then(result => {
            if (result) {
                const { status, json } = result;
                document.getElementById('response').innerHTML =
                    '<strong>Status Code:</strong> ' + status + '<br>' +
                    '<pre>' + JSON.stringify(json, null, 2) + '</pre>';
            }
        })
        .catch(error => console.error('Error:', error));
}