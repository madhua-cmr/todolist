//express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//instance of express
const app = express();
app.use(cors());
app.use(express.json());
//sample in-memory storage

//connecting mongodb
mongoose
  .connect("mongodb://localhost:27017/todo")
  .then(() => {
    console.log("Db connected");
  })
  .catch((err) => {
    console.log(err);
  });

//createing schema
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

//creating model
const todoModel = mongoose.model("Todo", todoSchema);

//let todos = [];
//create a new todo item -201
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  //   const newtodo = {
  //     id: todos.length + 1,
  //     title,
  //     description,
  //   };
  //   todos.push(newtodo);
  //   console.log(todos);
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//update todo item
app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "todo not found" });
    }
    res.json(updatedTodo);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: err.message });
  }
});
//delete todo item -204
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: err.message });
  }
});
//start the server
const port = 3000;

app.listen(port, () => {
  console.log("server is listening to port" + port);
});
