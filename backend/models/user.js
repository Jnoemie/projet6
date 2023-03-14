// import de mongoose
const mongoose = require('mongoose');

//import de unique validator 
const uniqueValidator = require('mongoose-unique-validator');


// modele de base de donné pour enregistrer un nouvel utilisateur 
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },// une adresse mail pour un user
  password: { type: String, required: true }
});

//methode de plugin pour controler le mail (pour ne pas enregistrer 2 fois la meme adresse)
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);