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
            const statusCode = response.status;
            return response.json().then(data => ({ data, statusCode }));
        })
        .then(({ data, statusCode }) => {
            displayResults(data, statusCode);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(data, statusCode) {
    const responseDiv = document.getElementById('response')
    responseDiv.innerHTML = ''

    // if status code is not 204, display error message
    if (statusCode !== 204) {
        responseDiv.innerHTML = '<strong>Status Code:</strong> ' + statusCode + '<br>' +
            '<pre>' + JSON.stringify(data.error, null, 2) + '</pre>';
        return
    }else{
        responseDiv.innerHTML = 'Post deleted';
    }


}