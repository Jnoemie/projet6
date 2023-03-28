const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const rateLimiter = require('../middleware/rateLimiter');



// route Post pour créer un compte ou se connecter 
router.post('/signup', userCtrl.signup);
router.post('/login', rateLimiter, userCtrl.login);

module.exports = router;