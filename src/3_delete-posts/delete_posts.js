import { GlobalSettings } from '../global_settings.js';

document.getElementById("delete").addEventListener("click", function() {deletePosts()})

function deletePosts() {
    const postID = document.getElementById('PostID').value;
    const url = GlobalSettings.apiUrl + '/posts/'+ postID;

    const token = localStorage.getItem('token');

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
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
            if (status === 204) {
                document.getElementById('response').innerHTML =
                    '<strong>Status Code:</strong> ' + status + '<br>'
            } else {
                document.getElementById('response').innerHTML =
                    '<strong>Status Code:</strong> ' + status + '<br>' +
                    '<pre>' + JSON.stringify(json, null, 2) + '</pre>';
            }
        })
        .catch(error => console.error('Error:', error));
}
