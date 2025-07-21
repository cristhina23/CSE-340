const throwError = (req, res, next) => {
  // This function intentionally throws an error to test error handling
  throw new Error("Intentional Server Error for Testing");
};

module.exports = {
  throwError,
};