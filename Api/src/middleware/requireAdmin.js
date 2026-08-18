const { User } = require('../db');

// Must run AFTER verifyToken (needs req.user.email). Confirms the
// authenticated caller is flagged as an admin (or superadmin) in
// Postgres before letting the request through.
const requireAdmin = async (req, res, next) => {
  if (!req.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const caller = await User.findOne({ where: { email: req.user.email } });

    if (!caller || (!caller.userAdmin && !caller.userSuperadmin)) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    req.callerUser = caller;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Stricter variant for actions that should be superadmin-only, e.g.
// granting admin rights to another user.
const requireSuperadmin = async (req, res, next) => {
  if (!req.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const caller = await User.findOne({ where: { email: req.user.email } });

    if (!caller || !caller.userSuperadmin) {
      return res.status(403).json({ error: 'Superadmin privileges required' });
    }

    req.callerUser = caller;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { requireAdmin, requireSuperadmin };
