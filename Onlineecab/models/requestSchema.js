import mongoose from "mongoose";

// Define schema for user ride requests
const requestSchema = new mongoose.Schema({
    source: String,
    destination: String,
    name: String,
    date: Date,
    // Define additional fields if needed
});

export default mongoose.model('Request', requestSchema);
