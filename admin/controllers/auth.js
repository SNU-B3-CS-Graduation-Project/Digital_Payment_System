import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { admin } from "../../common/models.js";
import { BlacklistedToken } from "../../common/models.js";


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const admin_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundAdmin = await admin.findOne({ email });
    if (!foundAdmin) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, foundAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (foundAdmin.is_blacklisted) {
      return res.status(403).json({ success: false, message: "Your account is blacklisted" });
    }


    // Create JWT
    const token = jwt.sign(
      {
        _id: foundAdmin._id,
        role: foundAdmin.role,
        full_name: foundAdmin.full_name,
        email: foundAdmin.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const admin_logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const decoded = jwt.decode(token);
    await BlacklistedToken.create({
      token,
      expiredAt: new Date(decoded.exp * 1000),
    });
  }

  return res.json({
    success: true,
    message: "Logged out. Token blacklisted.",
  });
};