// middlewares/authorizeRoles.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
      const { role } = req.user; // สมมติว่ามี role ใน JWT Token
      if (!allowedRoles.includes(role)) {
          return res.status(403).json({ message: 'Forbidden: You do not have access to this resource.' });
      }
      next();
  };
};

module.exports = {
  authorizeRoles
};
