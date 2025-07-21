const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", Utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inv_id", Utilities.handleErrors(invController.buildByInventoryId));

module.exports = router;