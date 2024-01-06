import { GlobalSettings } from '../global_settings.js';

document.getElementById("personalFeed").checked = false
let lastPostId = null
let limit = 10
let loggedIn = false
let personalFeed = false
let token = ""

document.getElementById("personalFeed").addEventListener("change", function () {
    token = localStorage.getItem('token')
    console.log(token)
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
    if (lastPostId == null) {
        paginationUrl = '?limit=' + limit
    } else {
        paginationUrl = '?postId=' + lastPostId + '&limit=' + limit
    }
    if (loggedIn && personalFeed) {
        feedTypeUrl += '&feedType=personal'
    } else {
        feedTypeUrl += '&feedType=global'
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
            return response.json()
        })
        .then(data => {
            displayResults(data);
        })
        .catch(error => console.error('Error:', error));
}

function displayResults(data) {
    const responseDiv = document.getElementById('response')
    responseDiv.innerHTML = ''

    if (data.records && data.records.length > 0) {

        responseDiv.innerHTML += 'Shown records ' + data.pagination.limit + ' - Total number of records ' + data.pagination.records + '<br><br>'

        data.records.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.innerHTML = `PostId: ${post.postId} Content: ${post.content}, Creation Date: ${post.creationDate}`;
            responseDiv.appendChild(postDiv);

            lastPostId = post.postId
        });
    } else {
        responseDiv.innerHTML = 'No users found';
    }

}
