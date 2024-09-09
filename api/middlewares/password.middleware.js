// Importation de password-validator 
const pwdVlt = require('password-validator')
// Création du shéma
let pwdShema = new pwdVlt()


// Le shema que doit respecté le password
pwdShema
  .is().min(5)
  .is().max(20)
  .has().uppercase(1)
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces()
  .is().not().oneOf(['Password', 'Password123']);


// Vérification de la qualité du password par rapport au shema
module.exports = (req, res, next) => {
  if (pwdShema.validate(req.body.password)) {
    next()
  } else {
    res
      .status(400)
      .json(
        {
          error: "no strong password :" + pwdShema.validate('req.body.password', { list: true })
        })
  }
}