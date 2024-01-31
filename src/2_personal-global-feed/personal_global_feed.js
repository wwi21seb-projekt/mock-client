import { GlobalSettings } from '../global_settings.js';

document.getElementById("personalFeed").checked = false
let lastPostId = null
let limit = 2
let loggedIn = false
let personalFeed = false
let token = ""

document.getElementById("personalFeed").addEventListener("change", function () {
    token = localStorage.getItem('token')
    if (token === null) { // if user is not logged in, no personal feed
        personalFeed = false
        document.getElementById("personalFeed").checked = false
    } else {
        loggedIn = true
        personalFeed = document.getElementById("personalFeed").checked;
    }

    resetResponse()
})


document.getElementById("getFeedButton").addEventListener("click", function () {
    resetResponse()
    getFeed()
})

document.getElementById("nextPage").addEventListener("click", function () {
    getFeed()
})

function resetResponse() {
    lastPostId = null
    document.getElementById('response').innerHTML = ''
}

function getFeed() {

    // Construct URL
    let baseUrl = GlobalSettings.apiUrl + '/feed'
    let paginationUrl
    let feedTypeUrl

    if (lastPostId === null) {
        paginationUrl = '?limit=' + limit
    } else {
        paginationUrl = '?postId=' + lastPostId + '&limit=' + limit
    }

    if (loggedIn && personalFeed) {
        feedTypeUrl = '&feedType=personal'
    } else {
        feedTypeUrl = '&feedType=global'
    }

    const url = baseUrl + paginationUrl + feedTypeUrl

    // Fetch data
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
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

    // if status code is not 200, display error message
    if (statusCode !== 200) {
        responseDiv.innerHTML = '<strong>Status Code:</strong> ' + statusCode + '<br>' +
            '<pre>' + JSON.stringify(data.error, null, 2) + '</pre>';
        return
    }

    if (data.records && data.records.length > 0) {
        responseDiv.innerHTML += 'Shown records ' + data.records.length + ' of ' + data.pagination.records + '<br><br>'

        data.records.forEach(post => {
            lastPostId = post.postId
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
                        <span>Author: ${(post.author.username)}</span>
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
                        <span>Author: ${(post.author.username)}</span>
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
