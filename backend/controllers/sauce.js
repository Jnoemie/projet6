const Sauce = require('../models/Sauce'); // import du model sauce

const fs = require('fs'); // file system permet de modifier , de supprimer des fichiers

// création, modification, suppression et récupération sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;    
    const sauce = new Sauce({ // un nouvel objet sauce est crée avec le model Sauce
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   // l'url de l'image enregistrée dans le dossier images du serveur est aussi stockée dans la bdd      
    });
    sauce.save() // la sauce est sauvegardée dans la bdd
        .then( () => res.status(201).json({ message: 'Sauce sauvegardée'}))
        .catch( error => res.status(400).json({ error }))
    
};
// Modification de la sauce
exports.modifySauce = (req, res, next) => { // on vérifie si la modification concerne le body ou un nouveau fichier image
    
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Sauce modifié'}))
    .catch(()=> res.status(400).json({ error}))
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // on identifie la sauce
    .then((sauce) => {
        if (!sauce) {
          res.status(404).json({error: 'Sauce non existante'});
        }
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({error: 'Requête non authorisée'});
        }
        const filename = sauce.imageUrl.split('/images/')[1]; // on recupere l'adresse de l'img
        fs.unlink(`images/${filename}`,() =>{ // on la supprime du server 
            Sauce.deleteOne({_id: req.params.id}) // on supprime la sauce de la base de donnée 
                .then(() => res.status(200).json({ message: 'Deleted!'}))
                .catch((error) => res.status(400).json({error: error}));
        });
    })
    .catch(error => res.status(500).json({ error }))
};

//like et dislike
exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
    if(like === 1) { // bouton j'aime
        Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous aimez cette sauce' }))
        .catch( error => res.status(400).json({ error}))

    } else if(like === -1) { // bouton je n'aime pas
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })
        .then( () => res.status(200).json({ message: 'Vous n’aimez pas cette sauce' }))
        .catch( error => res.status(400).json({ error}))

    } else {    // annulation du bouton j'aime ou alors je n'aime pas
        Sauce.findOne( {_id: req.params.id})
        .then( sauce => {
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1){
                 Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })
                .then( () => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))
                .catch( error => res.status(400).json({ error}))
                }
                
            else if( sauce.usersDisliked.indexOf(req.body.userId)!== -1) {
                Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})
                .then( () => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))
                .catch( error => res.status(400).json({ error}))
                }           
        })
        .catch( error => res.status(400).json({ error}))             
    }   
};


// on recupere une seule sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({error: error}));
};

// on recupere toutes les sauces 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({error: error}));
};

