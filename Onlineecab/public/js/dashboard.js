// Function to find a driver
function findDriver() {
    // Get source and destination from input fields
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    // You can now use these values to find a driver using Socket.IO or any other method
    // For demonstration purposes, let's assume you'll log the details to the console
    console.log('Source:', source);
    console.log('Destination:', destination);
    console.log('name', name);
    console.log('date', date);

    // After finding a driver, you can redirect the user to another page or perform further actions
    // For demonstration purposes, let's redirect to a page named 'searching-driver.html'
    window.location.href = '/searching-driver';
}

// Event listener for the 'Find Driver' button
document.getElementById('find-driver').addEventListener('click', findDriver);

// Function to get user's location
function getLocation() {
    // Your code to get the user's location goes here
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
}

function gotLocation(position) {
    const geocoder = new google.maps.Geocoder();
    const latlng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                const address = results[0].formatted_address;
                console.log(address)
                document.querySelector('.autocomplete.source').value = address;
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}

function failedToGet() {
alert('Please allow access to your location.');
}


}
