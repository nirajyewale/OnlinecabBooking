const socket = io();

// Event handler for when the driver receives a ride request
socket.on('requestRide', (rideData) => {
    const rideInfoDiv = document.getElementById('ride-info');

    document.getElementById('ride-info').innerText = `New Ride Request: From ${requestData.source} to ${requestData.destination} requested by ${requestData.name}`;

    // Add event listener to accept ride button
    const acceptRideBtn = document.getElementById('accept-ride-btn');
    acceptRideBtn.addEventListener('click', () => {
        const requestId = acceptRideBtn.getAttribute('data-request-id');
        acceptRide(requestId);
    });
});

// Function to emit event when driver accepts ride
function acceptRide(requestId) {
    // Emit event to server indicating that driver has accepted the ride
    socket.emit('acceptRide', requestId);

    // Update UI to inform the driver about the accepted request
    const rideInfoDiv = document.getElementById('ride-info');
    rideInfoDiv.innerHTML = `<p>Ride request accepted!</p>`;
}
