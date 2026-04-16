const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const tokenHeader = req.header("Authorization") || req.header("x-auth-token");

  if (!tokenHeader) {
    return res.status(401).json({ message: "אין גישה, חסר טוקן אימות" });
  }

  try {
    let token = tokenHeader;

    if (tokenHeader.startsWith("Bearer ")) {
      token = tokenHeader.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;

    next();
  } catch (e) {
    res.status(401).json({ message: "הטוקן אינו תקין" });
  }
};

module.exports = auth;
