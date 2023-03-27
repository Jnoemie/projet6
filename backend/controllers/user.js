const bcrypt = require('bcrypt'); // Chiffrer le mot de passe

const User = require ('../models/user'); // import du model ulisateur 

const jwt= require ('jsonwebtoken')// package token 


//const emailValidator = require('email-validator');// email validator package
//const passwordValidator = require('password-validator'); // password validator package

/*const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(50)                                  // Maximum length 50
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have at least 1 digit
.has().not().symbols();                         // Has no symbols
*/
// Inscription de l'utilisateur 

exports.signup = (req, res, next) => {
   /* if (!emailValidator.validate(req.body.email)) {
        throw {
          error: "L'adresse mail n'est pas valide !", // Making sure the amil is an email
        };
      } else if (!passwordSchema.validate(req.body.password)) {
        throw {
          error: "Le mot pass n'est pas valide !", // Making sure the password respect the schema
        };
      } else {*/
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({// creer un nouvel user
          email: req.body.email, // adresse mail
          password: hash // mot de passe haché
        });
        user.save() // mongoose le stocke dans la base de donnée
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
}
;


  // Connexion de l'utilisateur 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })// on verifie que l'adress mail est dans la base de donée
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)//on compare les mots de passe 
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                           { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 }