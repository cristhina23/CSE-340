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
  const data = await invModel.getInventoryById(inv_id)

  if (!data) {
    const err = new Error("Vehicle not found");
    err.status = 404;
    return next(err);
  } 
 
  const section = await utilities.getInventoryById(inv_id)
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
    const classificationSelect = await utilities.buildClassificationList();
    const success = req.flash("success");
    const notice = req.flash("notice");
    let message = success.length > 0 ? success[0] : notice.length > 0 ? notice[0] : null;
   

    res.render("inventory/management", {
      title: "Manage Inventory",
      nav,
      message,
      classificationSelect,
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
  let success = req.flash("success");
  let notice = req.flash("notice");

  let message = success.length > 0 ? success[0] : notice.length > 0 ? notice[0] : null;

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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventory_id)
    const itemData = await invModel.getInventoryById(inv_id)
    console.log("itemData:", itemData)
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    let success = req.flash("success");
    let notice = req.flash("notice");

    let message = success.length > 0 ? success[0] : notice.length > 0 ? notice[0] : null;

    if (!itemData) {
    return res.status(404).render("errors/404", {
      title: "Vehicle Not Found",
      message,
      nav,
    })
  }

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      message,
      classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

// Delete Inventory
invCont.buildDeleteInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventory_id)
    const itemData = await invModel.getInventoryById(inv_id)
    const nav = await utilities.getNav()
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    let success = req.flash("success");
    let notice = req.flash("notice");
    let message = success.length > 0 ? success[0] : notice.length > 0 ? notice[0] : null;

    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      message,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    })
  } catch (error) {
    next(error)
  }
}

invCont.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult.rowCount) {
      req.flash("success", "The inventory item was successfully deleted.")
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (error) {
    next(error)
  }
}



module.exports = invCont