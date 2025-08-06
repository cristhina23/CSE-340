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


invCont.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const success = req.flash("success");
    const notice = req.flash("notice");
    let message = success.length > 0 ? success[0] : notice.length > 0 ? notice[0] : null;
    const classificationSelect = await utilities.buildClassificationList() 

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
       message,
      classificationSelect, 
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      errors: null
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}


invCont.addInventory = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  try {
    const result = await invModel.addInventory(req.body);

    if (result) {
      req.flash("notice", "New vehicle added.");
      return res.redirect("/inv");
    } else {
      res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationSelect,
        message: null,
        errors: [{ msg: "Failed to add vehicle." }],
        ...req.body
      });
    }
  } catch (error) {
    console.error("Error adding inventory:", error);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      message: null,
      errors: [{ msg: "An unexpected error occurred." }],
      ...req.body
    });
  }
};


module.exports = invCont