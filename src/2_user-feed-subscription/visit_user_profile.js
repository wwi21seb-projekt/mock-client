import { GlobalSettings } from '../global_settings.js';

let offset = 0
let limit = 10

document.getElementById("openUser").addEventListener("click", function() {
    offset = 0
    openUser()
})
document.getElementById("nextPage").addEventListener("click", function(){
    offset += limit
    openUser()
})
document.getElementById("prevPage").addEventListener("click", function() {
    offset -= limit
    if (offset < 0) {
        offset = 0
    }
    openUser()
})

function openUser() {
    const username = document.getElementById('username').value;

    // fetch user profile information first
    fetch(GlobalSettings.apiUrl+'/users/'+username, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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

            if (status === 200) {
                localStorage.setItem('token', json.token); // store token in local storage
            }
        })
        .catch(error => console.error('Error:', error));

    // fetch user posts
    const url = GlobalSettings.apiUrl+'/posts?username=' + username + '&offset=' + offset + '&limit=' + limit
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            response.json()
        })
        .then(data => {
            displayResults(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    const responseDiv = document.getElementById('responseFeed')
    responseDiv.innerHTML = ''

    // if status code is not 200, display error message
    if (data.statusCode !== 200) {
        responseDiv.innerHTML = '<strong>Status Code:</strong> ' + data.statusCode + '<br>' +
            '<pre>' + JSON.stringify(data.message, null, 2) + '</pre>';
        return
    }

    if (data.records && data.records.length > 0) {
        const startRecord = offset + 1
        const endRecord = offset + data.records.length
        responseDiv.innerHTML += 'Shown records ' + startRecord + ' - ' + endRecord + 'of' + data.pagination.records + '<br><br>'

        data.records.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.innerHTML = `PostId: ${post.postId} Content: ${post.content}, Creation Date: ${post.creationDate}`;
            responseDiv.appendChild(postDiv);
        });
    } else {
        responseDiv.innerHTML = 'No users found';
    }
}