const express = require('express')
const router = express.Router();

// Load Controllers
const password = require('../controllers/users')

const {
    isLoggedAuth,
    isLoggedAuthIn
}= require('../middleware');

// Validation
const {
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../helpers/valid')

router.route('/')
.get(isLoggedAuth, isLoggedAuthIn)

router.route('/forget')
.get(password.renderForget)
.post(forgotPasswordValidator, password.forget);

router.route('/reset')
.get(isLoggedAuth, isLoggedAuthIn)

router.route('/reset/:token')
.get(password.renderReset)
.put( resetPasswordValidator, password.Reset);

module.exports = router