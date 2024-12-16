// driverSchema.js
import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    duname: { type: String, required: true },
    dpwd: { type: String, required: true }
});

export default mongoose.model('Driver', driverSchema);
