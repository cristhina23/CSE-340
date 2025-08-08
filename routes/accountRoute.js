const express = require('express');
const router = express.Router();
const Util = require('../utilities/index');
const accountCont = require('../controllers/accountController');
const accountValidate = require('../utilities/account-validation')

router.get('/login', Util.handleErrors(accountCont.buildMyAccount));
router.get('/register', Util.handleErrors(accountCont.buildRegister));
router.post(
  "/register",
  accountValidate.registationRules(),
  accountValidate.checkRegData,
  Util.handleErrors(accountCont.registerAccount)
);
router.post(
  "/login",
  accountValidate.LoginRules(),
  accountValidate.checkLoginData,
  Util.handleErrors(accountCont.accountLogin)
)

router.get('/', Util.checkLogin, Util.handleErrors(accountCont.manageAccount));

router.get("/update/:account_id", 
  Util.checkLogin, 
  Util.handleErrors(accountCont.buildUpdateAccount)
)

router.post("/update-info", 
  Util.checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateAccountData,
  Util.handleErrors(accountCont.updateAccountInfo)
)

router.post("/update-password", 
  Util.checkLogin,
  accountValidate.updatePasswordRules(),
  accountValidate.checkUpdatePasswordData,
  Util.handleErrors(accountCont.updateAccountPassword)
)

router.get("/logout", Util.handleErrors(accountCont.logout))


module.exports = router;