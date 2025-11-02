// middleware/admin.js

module.exports = (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ success: false, error: 'Admin access required' });
  next();
};