const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

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
    message: message.length > 0 ? message[0] : null
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


module.exports = accountCont