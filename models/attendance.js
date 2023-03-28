const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: false
    },
    subject: {
        type: String,
        required: true,
        unique: false
    }
    
}, {Timestamp})

module.exports = mongoose.model('Attend', AttendSchema);