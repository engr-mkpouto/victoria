const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
});
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    time: {
        type: String,
        required: true,
        unique: true
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
    ip: {
        type: String,
        required: true,
        unique: false
    },
    images: [ImageSchema],
    source: {
        type: String,
        required: true
    }
    
}, {Timestamp})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
