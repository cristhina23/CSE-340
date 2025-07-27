const express = require('express');
const router = express.Router();
const Util = require('../utilities/');
const accountCont = require('../controllers/accountController');

router.get('/login', Util.handleErrors(accountCont.buildMyAccount));
router.get('/register', Util.handleErrors(accountCont.buildRegister));
router.post('/register', Util.handleErrors(accountCont.registerAccount))

module.exports = router;