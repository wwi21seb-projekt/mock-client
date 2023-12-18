import { GlobalSettings } from '../global_settings.js';

document.getElementById("getImprintButton").addEventListener("click", getImprint)
function getImprint() {

    fetch(GlobalSettings.apiUrl+'/imprint', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: null
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