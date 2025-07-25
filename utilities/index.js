const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (/*req, res, next*/) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul class='menu'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
Util.BuildIndividualDetailPage = async function(inv_id){
  const data = await invModel.getIndividualDetails(inv_id)
  const vehicle = data
  let section = '<section class="vehicle-detail">'
  
  section += `<div class="vehicle-img">`
  section += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`
  section += `</div>`

  section += `<div class="vehicle-info">`
  section += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`
  section += `<p class="price"><span>Price: </span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
  section += `<p class="description"><span>Description: </span>${vehicle.inv_description}</p>`
  section += `<p><span>Color: </span> ${vehicle.inv_color}</p>`
  section += `<p><span>Miles: </span> ${vehicle.inv_miles}</p>`
  section += `</div>`

  section += '</section>'
  return section
}

Util.BuildErrorPage = function(error) {
  let content = '<section class="error-page">'
  content += `<h2>Oops! Something went wrong.</h2>`
  content += `<p><strong>Error:</strong> ${error.message || "Internal Server Error"}</p>`
  content += `<p>Please try again later or contact support.</p>`
  content += '</section>'
  return content
}


/****************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Get the parameter

Util.getParam = function(param) {
  const query = window.location.search;
  const urlParams = new URLSearchParams(query);
  return urlParams.get(param);
};

/****************************
 * Middleware For Handling Errors in pages
 
 **************************************** */

  Util.handleNotFound = async function (req, res) {
  let nav = await Util.getNav();
  let image
  res.status(404).render("error", {
    title: "404 Not Found",
    message: "The page you are looking for does not exist.",
    content: "",
    nav,
    image: "/images/errors/error404.jpg" 
  });
}

Util.handleServerError = async function (err, req, res, next) {
  console.error("Server Error:", err.stack);
  let nav = await Util.getNav();
  const errorContent = Util.BuildErrorPage(err);

 
  let image;
  if (err.status === 404) {
    image = "/images/errors/error404.jpg";
  } else {
    image = "/images/errors/error500.png"; 
  }

  res.status(err.status || 500).render("error", {
    title: err.status === 404 ? "404 Not Found" : "Server Error",
    message: err.message || "Something went wrong",
    content: errorContent,
    nav,
    error: err,
    image, 
  });
};




module.exports = Util