const express = require("express");
const passport = require("passport");
const users = require('../controllers/users')

const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const {
    isLoggedOut,
    isLoggedAuth,
    isLoggedAuthIn,
    isLoggedIn,
    isUser
}= require('../middleware');

const {
    validRegister, validStudent
} = require('../helpers/valid')

router.route('/activate')
.get(isLoggedAuth, isLoggedAuthIn);

router.route('/activate/:token')
.get(isLoggedOut, users.renderActivate)
.post(isLoggedOut, upload.array('image'), users.activation);

router.route('/index')
.get(isLoggedIn, isUser, CatchAsync( users.renderIndex ));

router.route('/login/auth/:token')
.get(isLoggedOut, users.renderAuth)
.post(isLoggedOut, users.auth, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.authsuccess)

router.route('/register')
.get(isLoggedOut, users.renderRegister )
.post(isLoggedOut, validRegister, CatchAsync(users.register))

router.route('/authenticate')
.get(isLoggedOut, users.renderFinger )
.post(isLoggedOut, CatchAsync(users.finger))

router.route('/index/register')
.get(isLoggedIn, isUser, users.renderStudentReg )
.post(isLoggedIn, isUser, validStudent, CatchAsync(users.Reg))

router.route('/index/register/:token')
.get(isLoggedIn, isUser, users.renderPics )
.post(isLoggedIn, isUser, upload.array('image'), CatchAsync(users.RegComplete));

router.route('/index/success')
.get(isLoggedIn, isUser, users.renderRegSuccess );

router.route('/login')
.get(isLoggedOut, users.renderLogin)
.post(users.admin, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router