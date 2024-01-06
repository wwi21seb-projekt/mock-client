import { GlobalSettings } from '../global_settings.js';

let offset = 0
let limit = 10

document.getElementById("search").addEventListener("click", function() {
    offset = 0
    searchUsers()
})
document.getElementById("nextPage").addEventListener("click", function(){
  offset += limit
    searchUsers()
})
document.getElementById("prevPage").addEventListener("click", function() {
    offset -= limit
    if (offset < 0) {
        offset = 0
    }
    searchUsers()
})

function searchUsers() {
    const username = document.getElementById('username').value;
    const url = GlobalSettings.apiUrl+'/users?username=' + username + '&offset=' + offset + '&limit=' + limit

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
    const responseDiv = document.getElementById('response')
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

        data.records.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.innerHTML = `Username: ${user.username}, Nickname: ${user.nickname}`;
            responseDiv.appendChild(userDiv);
        });
    } else {
        responseDiv.innerHTML = 'No users found';
    }

}