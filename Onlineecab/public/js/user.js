// client-side script (user.js)
const socket = io();

function requestDriver() {
    const source = document.getElementById('source').value;
    const destination = document.getElementById('destination').value;
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
        // Check if both source and destination are provided
        if (source === '' || destination === ''|| name === ''|| date === '') {
            alert('Please enter all the textbox');
            return; // Prevent further execution if fields are not filled
        }
    // Emit event to request a driver
    socket.emit('requestRide', { source, destination, name, date });
}
