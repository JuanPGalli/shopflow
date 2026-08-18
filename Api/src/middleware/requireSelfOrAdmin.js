const { User } = require('../db');

// Must run AFTER verifyToken. Allows the request through if the
// authenticated caller's email matches the :email route param
// (they're looking at their own data), or if they're an admin.
const requireSelfOrAdmin = async (req, res, next) => {
  if (!req.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const targetEmail = req.params.email;

  if (req.user.email.toLowerCase() === (targetEmail || '').toLowerCase()) {
    return next();
  }

  try {
    const caller = await User.findOne({ where: { email: req.user.email } });
    if (caller && (caller.userAdmin || caller.userSuperadmin)) {
      req.callerUser = caller;
      return next();
    }
    return res.status(403).json({ error: 'You can only access your own data' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = requireSelfOrAdmin;
