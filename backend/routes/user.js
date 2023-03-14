const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// route Post pour créer un compte ou se connecter 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;