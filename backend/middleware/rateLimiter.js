const rateLimit = require('express-rate-limit'); 


module.exports = rateLimit({
    windowMs: 2 * 60 * 1000, // Temps défini (en minutes) pour tester l'application
    max: 3 ,// essais max par adresse ip
    message: 'limite du taux de demandes dépassée!', 
});