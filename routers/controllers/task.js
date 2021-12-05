const taskModel = require("./../../db/models/task");

const getAllTasks = (req, res) => {
  const { user } = req.body;
  taskModel
    .find({ isDeleted: false })
    .populate("user")
    .where("user")
    .equals(user)
    .exec(function (err, todos) {
      if (!todos) {
        return res.status(404).json("you dont have an account");
      }
      if (!todos.length) {
        return res.json("you dont have any task"); 
      }
      if (err) return handleError(err);
      res.json(todos);
    });
};

const getAllDeletedTasks = (req, res) => {
  const { user } = req.body;
  taskModel
    .find({ isDeleted: true })
    .populate("user")
    .where("user")
    .equals(user)
    .exec(function (err, todos) {
      if (!todos) {
        return res.status(404).json("you dont have an account");
      }
      if (!todos.length) {
        return res.json("you dont have any deleted task");
      }
      if (err) return handleError(err);
      res.json(todos);
    });
};

const getTask = (req, res) => {
  const { _id } = req.body; 
  taskModel
    .findById({ _id })
    .then((result) => {
      if (result.isDeleted == true) {
        return res.json("this task have been deleted");
      }
      res.json(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

const createTask = (req, res) => {
  const { name, user } = req.body;
  const newTask = new taskModel({
    name,
    
  });

  newTask.save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const updateTask = (req, res) => {
  const { _id, newName } = req.body;

  taskModel.findById({ _id }).then((result) => {
    console.log(result);
    if (result.isDeleted == true) {
      return res.json(
        "you cant update on this task because its have been deleted"
      );
    } else {
      taskModel.updateOne({ _id }, { $set: { name: newName } }, function (err) {
        if (err) return handleError(err);
      });
      taskModel
        .find({ _id })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};

const deleteTask = (req, res) => {
  const { _id } = req.body;
  taskModel.findById({ _id }).then((result) => {
    if (result.isDeleted == true) {
      return res.json("this task already have been deleted");
    } else {
      taskModel.updateOne(
        { _id },
        { $set: { isDeleted: true } },
        function (err) {
          if (err) return handleError(err);
        }
      );
      taskModel
        .find({ _id })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};

module.exports = {
  getAllTasks,
  getAllDeletedTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
