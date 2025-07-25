const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  req.flash("notice", "Welcome to the Car Dealership")
  res.render(
    "index", {title: "Home", nav})
}

module.exports = baseController