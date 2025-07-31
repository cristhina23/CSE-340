const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")

const invValidate = {}

/* **********************************
 *  Classification Data Validation Rules
 * ********************************* */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a classification name."),
  ]
}

/* ******************************
 * Check classification data and return errors 
 * ***************************** */
invValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    req.flash("notice", errors.array()[0].msg)
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
    return
  }
  next()
}

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
invValidate.inventoryRules = () => {
  return [
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification."),

    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be between 1900 and 2099."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required.")
  ]
}

/* ******************************
 * Check inventory data and return errors 
 * ***************************** */
invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      message: null,
      ...req.body
    })
    return
  }
  next()
}

module.exports = invValidate
