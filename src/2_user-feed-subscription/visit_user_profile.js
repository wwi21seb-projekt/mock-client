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
    const token = localStorage.getItem('token')

    // fetch user profile information
    fetch(GlobalSettings.apiUrl + '/users/' + username, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json().then(json => ({
                    status: response.status,
                    json
                }));
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(({ status, json }) => {
            document.getElementById('response').innerHTML =
                '<strong>Status Code:</strong> ' + status + '<br>' +
                '<pre>' + JSON.stringify(json, null, 2) + '</pre>';
        })
        .catch(error => {
            console.error('Error:', error);
        });


    // fetch user posts
    const url = GlobalSettings.apiUrl+'/users/' + username + '/feed?offset=' + offset + '&limit=' + limit
    fetch(url, {
        method: 'GET',
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
    const responseDiv = document.getElementById('responseFeed')
    responseDiv.innerHTML = ''

    // if status code is not 200, display error message
    if (statusCode !== 200) {
        responseDiv.innerHTML = '<strong>Status Code:</strong> ' + statusCode + '<br>' +
            '<pre>' + JSON.stringify(data.error, null, 2) + '</pre>';
        return
    }

    if (data.records && data.records.length > 0) {
        const startRecord = offset + 1
        const endRecord = offset + data.records.length
        responseDiv.innerHTML += 'Shown records ' + startRecord + ' - ' + endRecord + ' of ' + data.pagination.records + '<br><br>'

        data.records.forEach(post => {
            const postDiv = document.createElement('div');

            let contentHTML
            if(post.location != null){
                contentHTML = `
                    <div class="post-header">
                        <h3>Post ID: ${post.postId}</h3>
                    </div>
                    <div class="post-content">
                        <p>${post.content}</p>
                    </div>
                    <div class="post-footer">
                        <span>Creation Date: ${new Date(post.creationDate).toLocaleDateString()}</span>
                    </div>
                    <div class="post-footer">
                        <span>Location: ${post.location.longitude}°, ${post.location.latitude}°, ${post.location.accuracy}m</span>
                    </div>
                `;
            } else {
                contentHTML = `
                    <div class="post-header">
                        <h3>Post ID: ${post.postId}</h3>
                    </div>
                    <div class="post-content">
                        <p>${post.content}</p>
                    </div>
                    <div class="post-footer">
                        <span>Creation Date: ${new Date(post.creationDate).toLocaleDateString()}</span>
                    </div>
                    `;
            }

            postDiv.innerHTML = contentHTML;
            responseDiv.appendChild(postDiv);
        });
    } else {
        responseDiv.innerHTML = 'No posts found';
    }
}