const express = require("express");
require("dotenv").config();

require("./db");

const app = express();
app.use(express.json());

const roleRouter = require("./routers/routs/role");
app.use("/role", roleRouter);

const userRouter = require("./routers/routs/user");
app.use("/user", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
