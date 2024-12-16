import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/userSchema.js';
import Driver from './models/driverSchema.js';
import Request from './models/requestSchema.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/todo");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
})();

// Socket.IO event handler for user ride requests
io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('requestRide', async (requestData) => {
        try {
            // Extract request details
            const { source, destination, name, date } = requestData;

            // Create a new document to save the request details to MongoDB
            const newRequest = new Request({
                source,
                destination,
                name,
                date,
            });

            // Save the request to MongoDB
            await newRequest.save();

            // Emit an event to inform the user that the request has been received
            socket.emit('rideRequestReceived', { message: 'Your ride request has been received.' });

            // Find a driver for the user's ride request
            const availableDriverId = findAvailableDriver(); // Implement this function
            if (availableDriverId) {
                // Emit event to the available driver
                io.to(availableDriverId).emit('newRideRequest', requestData);
            } else {
                // If no driver is available, inform the user
                socket.emit('noDriverAvailable', { message: 'Sorry, no drivers available at the moment.' });
            }
        } catch (error) {
            console.error('Error handling ride request:', error);
            // Handle errors appropriately
            socket.emit('requestError', { message: 'An error occurred while processing your request.' });
        }
    });


    // Event handler when a client disconnects
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});


// Routes
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log("Home Page");
    res.render('Home');
});

app.get('/searching-driver', (req, res) => {
    res.render('searching-driver');
});

app.get('/about', (req, res) => {
    console.log("Info Page");
    res.render('Info');
});

app.get('/login', (req, res) => {
    console.log("Login Page");
    res.render('Login');
});

app.get('/contact', (req, res) => {
    console.log("Contact Page");
    res.render('Contact');
});

app.get('/signup', (req, res) => {
    console.log("Signup Page");
    res.render('Signup', { error: null });
});

app.get('/profile', (req, res) => {
    console.log("Profile Page");
    res.render('Profile', { error: null });
});

app.get('/driverlogin', (req, res) => {
    console.log("DriverLogin Page");
    res.render('DriverLogin',{ error: null });
});

app.get('/driversignup', (req, res) => {
    console.log("DriverSignup Page");
    res.render('DriverSignup', { error: null }); // Pass error as null initially
});

app.get('/driverprofile', (req, res) => {
    console.log("Driver Page");
    res.render('Driverprofile');
});

app.get('/Booking', (req, res) => {
    console.log("Booking Page");
    res.render('Booking'); // Pass error as null initially
});

// Signup route
app.post("/signup", async (req, res) => {
    const { uname, psw } = req.body;

    try {
        if (!uname || !psw) {
            return res.status(400).send('Username and password are required.');
        }

        // Check if the username already exists in the database
        const existingUser = await User.findOne({ uname });

        if (existingUser) {
            return res.status(400).send('User already exists. Please choose a different username.');
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(psw, saltRounds);

        // Create a new user
        const newUser = new User({
            uname,
            pwd: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        res.render('Login');
    } catch (error) {
        console.error('Error signing up user:', error);
        res.status(500).send('Error signing up user');
    }
});


app.post("/login", async (req, res) => {
    const { username, pwd } = req.body; // Changed password to pwd

    // Find the user in the database
    try {
        const user = await User.findOne({ uname: username });

        // If user does not exist
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check if the password is correct
        const validPassword = await bcrypt.compare(pwd, user.pwd); // Changed password to pwd
        if (!validPassword) {
            return res.status(401).send('Invalid password');
        }

        // Successful login
        res.render('Profile', { username: user.uname });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});


app.post("/driverlogin", async (req, res) => {
    const { duname, dpwd } = req.body;

    try {
        // Find the driver in the database
        const driver = await Driver.findOne({ duname });

        // If driver does not exist
        if (!driver) {
            return res.status(404).send('Driver not found');
        }

        // Trim and normalize whitespace in the submitted password
        const submittedPassword = dpwd.trim();

        // Trim and normalize whitespace in the hashed password from the database
        const databasePassword = driver.dpwd.trim();

        // Log information for debugging
        console.log('Submitted password:', submittedPassword);
        console.log('Length of submitted password:', submittedPassword.length);
        console.log('Hashed password from database:', databasePassword);
        console.log('Length of hashed password from database:', databasePassword.length);
        console.log('Comparing passwords...');

        // Compare the passwords after converting both to the same format and encoding
        const validPassword = await bcrypt.compare(submittedPassword, databasePassword);

        // Log the result of the comparison
        console.log('Is password valid?', validPassword);

        // If passwords match
        if (validPassword) {
            console.log('Password is valid');
            res.render('Driverprofile', { username: driver.duname });
        } else {
            console.log('Invalid password');
            res.status(401).send('Invalid password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

// Driver Signup Route
app.post("/driversignup", async (req, res) => {
    const { uname, psw } = req.body;

    try {
        if (!uname || !psw) {
            return res.status(400).send('Username and password are required.');
        }

        // Check if the driver already exists in the database
        const existingDriver = await Driver.findOne({ duname: uname });
        if (existingDriver) {
            return res.status(400).send('Driver already exists. Please choose a different username.');
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(psw, saltRounds);

        // Create a new driver with hashed password
        const newDriver = new Driver({
            duname: uname,
            dpwd: hashedPassword
        });

        // Save the new driver to the database
        console.log("Saving new driver...");
        await newDriver.save();
        console.log("Driver registered successfully!");
        res.render('DriverLogin');
    } catch (error) {
        console.error('Error registering driver:', error);
        res.status(500).send('Error registering driver');
    }
});

// Middleware for logging requests
app.use((req, res, next) => {
    console.log("Received request body:", req.body);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send(`Something broke! Error: ${err.message}`);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
