/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorTestRoute = require("./routes/errorTestRoute")
const Util = require("./utilities/")
const utilities = require("./utilities/")
const session = require("express-session")
const flash = require("connect-flash")
const messages = require("express-messages")
const pool = require('./database/')
const accountController = require('./controllers/accountController')
const accountRoute = require('./routes/accountRoute')

/* ***********************
 * Middleware (BEFORE ROUTES)
 *************************/

// Session middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Flash and messages middleware
app.use(flash())
app.use(function(req, res, next){
  res.locals.messages = messages(req, res)
  res.locals.message = req.flash("notice") // Optional if you want to use this directly
  next()
})

/* ***********************
 * Static files
 *************************/
app.use(static)

/* ***********************
 * Set View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout","./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use("/inv", inventoryRoute)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/", errorTestRoute)

// account routes
app.use("/account", accountRoute)


/* ***********************
 * Error Handling
 *************************/
app.use(Util.handleServerError)
app.use(Util.handleNotFound)

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
