const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const rateLimiter = require('../middleware/rateLimiter');
const password = require('../middleware/password');


// route Post pour créer un compte ou se connecter 
router.post('/signup',password , userCtrl.signup);
router.post('/login', rateLimiter, userCtrl.login);

module.exports = router;