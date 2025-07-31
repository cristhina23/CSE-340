const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      const error = new Error("No vehicles found for this classification.");
      error.status = 404;
      throw error;
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;

    res.render("inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (err) {
    next(err); 
  }
}

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
   console.log("ID recibido:", inv_id)
  const data = await invModel.getIndividualDetails(inv_id)

  if (!data) {
    const err = new Error("Vehicle not found");
    err.status = 404;
    return next(err);
  } 
 
  const section = await utilities.BuildIndividualDetailPage(inv_id)
  let nav = await utilities.getNav()

    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      layout: './layouts/layout', 
      section
    })
  } catch (err) {
    next(err);
  }
}

invCont.buildManageInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const success = req.flash("success");
    const notice = req.flash("notice");
    res.render("inventory/management", {
      title: "Manage Inventory",
      nav,
      message: success.length > 0 ? success[0] : notice.length > 0 ? notice[0] : null,
    });
  } catch (err) {
    next(err);
  }
}

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",

      nav,
    });
  } catch (err) {
    next(err);
  }
}

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  try {
    const data = await invModel.addNewClassification(classification_name);

    if (data) {
      req.flash("success", `Congratulations, you have registered a new classification: ${classification_name}`);
      res.redirect("/inv"); 
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.redirect("/inv/add-classification"); 
    }
  } catch (error) {
    console.error("error in addClassification:", error);
    next(error);
  }
};



module.exports = invCont