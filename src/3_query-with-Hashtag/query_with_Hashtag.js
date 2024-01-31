import { GlobalSettings } from '../global_settings.js';

let postID;
let limit = 2;

document.getElementById("search").addEventListener("click", function() {
    searchPosts()
})
document.getElementById("nextPage").addEventListener("click", function(){
    searchPosts()
})


function searchPosts() {
    const hashtag = document.getElementById('Hashtag').value;
    let url;
    if(postID){
        url = GlobalSettings.apiUrl + '/posts?q=' + hashtag +  '&postId=' + postID + '&limit=' + limit;
    }else{
        url = GlobalSettings.apiUrl + '/posts?q=' + hashtag + '&limit=' + limit;
    }   

    const token = localStorage.getItem('token');

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
            postID = post.postId
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