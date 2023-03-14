const multer = require ('multer');

// dictionnaire extension images 
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'images/gif':'gif'
  };
  

  // destination des images 
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'images');
    },

// nouveau nom du fichier afin d'eviter les doublons 
    filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
  });
  
  module.exports = multer({storage: storage}).single('image');