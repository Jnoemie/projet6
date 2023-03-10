const express = require('express');
const router = express.Router();

const ctrlSauces = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');



module.exports = router;