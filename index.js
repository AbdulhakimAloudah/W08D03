const express = require("express");
require("dotenv").config();

require("./db");

const app = express();
app.use(express.json());

const roleRouter = require("./routers/routes/role");
app.use("/role", roleRouter);

const userRouter = require("./routers/routes/user");
app.use("/user", userRouter);


const taskRouter = require("./routers/routes/task");
app.use("/task", taskRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});





