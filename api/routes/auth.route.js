const router = require('express').Router();
const { signup, signin } = require('../controllers/auth.controller');
const password = require('../middlewares/password.middleware')


router.post('/sign-up', password, signup)
router.post('/sign-in', signin)

module.exports = router