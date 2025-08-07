const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// --------------------
// Vistas públicas (sin login)
// --------------------
router.get("/type/:classificationId", Utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inv_id", Utilities.handleErrors(invController.buildByInventoryId))

// --------------------
// Vistas administrativas (protegidas)
// --------------------
router.get(
  "/",
  Utilities.checkLogin,
  Utilities.checkAccountType,
  Utilities.handleErrors(invController.buildManageInventory)
)

router.get(
  "/add-classification",
  Utilities.checkLogin,
  Utilities.checkAccountType,
  Utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification", 
  Utilities.checkLogin,
  Utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  Utilities.handleErrors(invController.addClassification)
)

router.get(
  "/add-inventory",
  Utilities.checkLogin,
  Utilities.checkAccountType,
  Utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  Utilities.checkLogin,
  Utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  Utilities.handleErrors(invController.addInventory)
)

router.get(
  "/getInventory/:classification_id",
  Utilities.checkLogin,
  Utilities.checkAccountType,
  Utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
  "/edit/:inventory_id",
  Utilities.checkLogin,
  Utilities.checkAccountType,
  Utilities.handleErrors(invController.editInventoryView)
)

router.post(
  "/update",
  Utilities.checkLogin,
  Utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  Utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/delete/:inventory_id",
  Utilities.checkLogin,
  Utilities.checkAccountType,
  Utilities.handleErrors(invController.buildDeleteInventoryView)
)

router.post(
  "/delete",
  Utilities.checkLogin,
  Utilities.checkAccountType,
  Utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router
