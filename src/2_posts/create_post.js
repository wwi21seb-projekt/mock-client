import { GlobalSettings } from '../global_settings.js';

document.getElementById("createPost").addEventListener("click", create_post)

function create_post() {
    const content = document.getElementById('content').value;
    const image = document.getElementById('image').files[0];
    const token = localStorage.getItem('token')

    const longitude = document.getElementById('longitude').value;
    const latitude = document.getElementById('latitude').value;
    const accuracy = document.getElementById('accuracy').value;

    if (image == null) {
        let postCreateRequestDTO
        if (longitude === "" || latitude === "" || accuracy === "") {
            postCreateRequestDTO = {
                content: content
            };
        } else {
            const accuracyInt = parseInt(accuracy)
            const latitudeFloat = parseFloat(latitude)
            const longitudeFloat = parseFloat(longitude)

            postCreateRequestDTO = {
                content: content,
                location: {
                    longitude: longitudeFloat,
                    latitude: latitudeFloat,
                    accuracy: accuracyInt
                }
            };
        }

        fetch(GlobalSettings.apiUrl+'/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(postCreateRequestDTO)
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
    else {
        // Create FormData object
        let formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        fetch(GlobalSettings.apiUrl+'/posts', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
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
}