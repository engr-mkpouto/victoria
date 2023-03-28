const express = require("express");
const admin = require('../controllers/admin')
const passport = require('passport');

const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const {
    isLoggedAuth,
    isLoggedAuthIn,
    isAdmin,
    isAdminAndLogIn
}= require('../middleware');

const {
    validRegister
} = require('../helpers/valid')

router.route('/')
.get(isLoggedAuth, isLoggedAuthIn)

router.route('/activate')
.get(isLoggedAuth, isLoggedAuthIn)

router.route('/activate/:token')
.get(admin.activation)

router.route('/register')
.get(isLoggedAuth, admin.renderRegister)
.post(isLoggedAuth, validRegister, CatchAsync(admin.register))

router.route('/dashboard')
.get(isLoggedAuth, isAdmin, admin.renderDashboard)

router.get('/search', isLoggedAuth, isAdmin, admin.search)
router.post('/search/q', isLoggedAuth, isAdmin, admin.sq)
router.post('/search/pass', isLoggedAuth, isAdmin, admin.pass)

router.route('/dashboard/users/:id')
.get(isLoggedAuth, isAdmin, admin.renderUser)

router.route('/dashboard/student/:id')
.get(isLoggedAuth, isAdmin, admin.renderStudent);

router.route('/login')
.get(isAdminAndLogIn, admin.renderLogin)
.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/admin/login' }), admin.check, admin.login)

router.get('/logout', admin.logout);

module.exports = router