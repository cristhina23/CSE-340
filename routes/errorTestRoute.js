// routes/errorRoute.js

const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");
const Util = require("../utilities/"); // Assuming your async wrapper is in utilities

// Route that triggers an intentional server error
router.get("/error-test", Util.handleErrors(errorController.throwError));

module.exports = router;
