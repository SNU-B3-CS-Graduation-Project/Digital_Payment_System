import dotenv from "dotenv";
dotenv.config({ path: ".env", debug: true });

import connectDB from "../common/mongoose.js";
// Connect to DB
connectDB();


import configureExpress from "./express.js";

const app = configureExpress();
const port = process.env.ADMIN_PORT || 4001;
 
// Start Server
app.listen(port, () => {
  console.log(`🚀 Digital Payment Admin API running on port ${port}`);
});

export default app;