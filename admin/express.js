import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import session from "express-session";

// 🛠 Import your routes here
import adminRoutes from "./routes/admin.js";
import menuRoutes from "./routes/menu.js";
import facultyRoutes from "./routes/faculty.js";
import departmentRoutes from "./routes/department.js";



export default function configureExpress() {
  const app = express();

  // 🌍 CORS for frontend communication (React/Next.js)
  app.use(cors({
    origin: "http://localhost:3000", // Update to your React/Next.js domain
    credentials: true
  }));

  // 📦 General middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  app.use(helmet());
  app.use(morgan("dev"));

  // Optional: Session middleware (if you use session-based admin)
  app.use(session({
    secret: process.env.SESSION_SECRET || "SNU_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // use true if HTTPS
  }));

  // 🧩 Mount your API routes here
  adminRoutes(app);
  menuRoutes(app);
  facultyRoutes(app);
  departmentRoutes(app);

  // 🚫 404 Handler (for APIs)
  app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "API endpoint not found" });
  });

  // ⚠️ Global Error Handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  });

  return app;
}
