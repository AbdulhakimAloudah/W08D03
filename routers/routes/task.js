const express = require("express");
const taskRouter = express.Router();

const {
  getAllTasks,
  getAllDeletedTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("./../controllers/task");

taskRouter.get("/", getAllTasks); 
taskRouter.get("/deltedTasks", getAllDeletedTasks); 
taskRouter.get("/one", getTask); 
taskRouter.post("/create", createTask);
taskRouter.put("/update", updateTask);
taskRouter.delete("/delete", deleteTask); 

module.exports = taskRouter;
