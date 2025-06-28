import jwt from "jsonwebtoken";
import { BlacklistedToken } from "../common/models.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized. Token required." });
  }

  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) {
    return res.status(401).json({ success: false, message: "Token is blacklisted. Please login again." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export const isSuperAdmin = async (req, res, next) => {
  if (!req.admin || req.admin.role !== "super_admin") {
    return res.status(403).json({ success: false, message: "Access denied. Super Admin only." });
  }
  next();
};

export const isFinanceAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== "finance_admin") {
    return res.status(403).json({ success: false, message: "Access denied. Finance Admin only." });
  }
  next();
};
