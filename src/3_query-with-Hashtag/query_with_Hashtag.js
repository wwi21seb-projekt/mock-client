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
        url = GlobalSettings.apiUrl + '/posts/?q=' + hashtag +  '&postId=' + postID + '&limit=' + limit;
    }else{
        url = GlobalSettings.apiUrl + '/posts/?q=' + hashtag + '&limit=' + limit;
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

    postID = data.records[data.records.length - 1].postID;

    if (data.records && data.records.length > 0) {
        const startRecord = offset + 1
        const endRecord = offset + data.records.length
        responseDiv.innerHTML += 'Shown records ' + startRecord + ' - ' + endRecord + ' of ' + data.pagination.records + '<br><br>'

        data.records.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.innerHTML = `PostID: ${post.postID}, Content: ${post.content}`;
            responseDiv.appendChild(postDiv);
        });
        
    } else {
        responseDiv.innerHTML = 'No Posts found found';
    }

}