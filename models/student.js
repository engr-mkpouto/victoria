const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
});
const StudentSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: false
    },
    fname: {
        type: String,
        required: true,
        unique: false
    },
    lname: {
        type: String,
        required: true,
        unique: false
    },
    reg: {
        type: String,
        required: true,
        unique: false
    },
    time: {
        type: String,
        required: true,
        unique: false
    },
    date: {
        type: String,
        required: true,
        unique: false
    },
    year: {
        type: String,
        required: true,
        unique: false
    },
    images: [ImageSchema],
    subject: [{
        type: String,
        unique: false
    }],
    password: {
        type: String,
        required: false
    }
    
}, {Timestamp})

module.exports = mongoose.model('Student', StudentSchema);