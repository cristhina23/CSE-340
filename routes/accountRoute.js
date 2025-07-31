const express = require('express');
const router = express.Router();
const Util = require('../utilities/');
const accountCont = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

router.get('/login', Util.handleErrors(accountCont.buildMyAccount));
router.get('/register', Util.handleErrors(accountCont.buildRegister));
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountCont.registerAccount)
);
router.post(
  "/login",
  regValidate.LoginRules(),
  regValidate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;