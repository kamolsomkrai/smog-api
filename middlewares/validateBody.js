// middlewares/validateBody.js
const validateBody = (schema) => {
  return (req, res, next) => {
      const { error, value } = schema.validate(req.body);
      if (error) {
          return res.status(400).json({ message: `Validation error: ${error.details[0].message}` });
      }
      req.body = value;
      next();
  };
};

module.exports = {
  validateBody
};
