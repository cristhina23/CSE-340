const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Utilities = require("../utilities/");
const { get } = require("./static");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", Utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inv_id", Utilities.handleErrors(invController.buildByInventoryId));

router.get("/", Utilities.handleErrors(invController.buildManageInventory));

router.get("/add-classification", Utilities.handleErrors(invController.buildAddClassification));

router.post("/add-classification", 
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  Utilities.handleErrors(invController.addClassification));

router.get('/add-inventory', Utilities.handleErrors(invController.buildAddInventory));

router.post('/add-inventory',
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  invController.addInventory
);

router.get("/getInventory/:classification_id", Utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inventory_id", Utilities.handleErrors(invController.editInventoryView));

router.post("/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  Utilities.handleErrors(invController.updateInventory)
);


module.exports = router;