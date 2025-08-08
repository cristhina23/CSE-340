const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}

/* ****************************************
*  Deliver login view
* *************************************** */

accountCont.buildMyAccount = async function(req, res, next) {
  let nav = await utilities.getNav()
  let notice = req.flash("notice")
  let success = req.flash("success")
  let message = notice.length > 0 ? notice[0] : success.length > 0 ? success[0] : null

  res.render("account/login", { 
    title: "Login", 
    nav,
    message,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegister = async function(req, res, next) {
  let nav = await utilities.getNav()
  let message = req.flash("notice")
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    message: message.length > 0 ? message[0] : null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
 accountCont.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
  title: "Registration",
  nav,
  errors: null,
  message: "There was an error processing the registration.",
  account_firstname,
  account_lastname,
  account_email
})

  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
     res.redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.redirect("/account/register")
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  console.log("Password ingresado:", account_password)
console.log("Password en BD:", accountData.account_password)
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

accountCont.manageAccount = async function (req, res, next) {
  let nav = await utilities.getNav()
  let notice = req.flash("notice")
  let success = req.flash("success")
  let message = notice.length > 0 ? notice[0] : success.length > 0 ? success[0] : null
  
  res.render("account/my-account", { 
    title: "My Account", 
    nav,
    message,
    account_firstname: res.locals.accountData.account_firstname,
    account_type: res.locals.accountData.account_type,
    account_id: res.locals.accountData.account_id
  })
}



module.exports = accountCont