//import de mongoose
const mongoose = require('mongoose');

// schema du modèle de sauce demandé
const sauceSchema = mongoose.Schema({

    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: [{ type: String }],
    usersDisliked: [{ type: String }],
});

//export du schema des sauces

module.exports = mongoose.model('Sauce', sauceSchema);