const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 4000;
require('dotenv').config();

const ObjectId = require("mongoose").Types.ObjectId;


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

const todosSchema = new mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  todos: [
    {
      checked: Boolean,
      text: String,
      id: String,
    },
  ],
});
const Todos = mongoose.model("Todos", todosSchema);

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();
  if (user) {
    res.status(500);
    res.json({
      message: "user already exists",
    });
    return;
  }
  await User.create({ username, password });
  res.json({
    message: "success",
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "invalid login",
    });
    return;
  }
  res.json({
    message: "success",
  });
});

app.post("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, password] = token.split(":");
  const todosItems = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "invalid access",
    });
    return;
  }
  const todos = await Todos.findOne({ userId: user._id }).exec();
  if (!todos) {
    await Todos.create({
      userId: user._id,
      todos: todosItems,
    });
  } else {
    todos.todos = todosItems;
    await todos.save();
  }
  res.json(todosItems);
});

app.get("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, password] = token.split(":");
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "invalid access",
    });
    return;
    if (todos) {
      const {todos }= await (await Todos.findOne({userId:user._id})).exec();
       res.json(todos);
     } else {
       res.json([]);
     }
   
  }
  // if (todos) {
  //   const {todos }= await (await Todos.findOne({userId:user._id})).exec();
  //    res.json(todos);
  //  } else {
  //    res.json([]);
  //  }
 

 
  
  // const {todos} = await Todos.findOne({ userId: user._id }).exec();
  // res.json(todos);
});


mongoose.connect(process.env.MONGO_DB_URL,
{
     useNewUrlParser:true,
useCreateIndex:true,
useUnifiedTopology:true ,
useFindAndModify: false
})
.then(() => {
    console.log("db connections is successful");
})
. catch ((e)=> {
    console.log("NO connection");
} )

app.listen(port ,()=> {
    console.log(`Example app listening at ${port}` );
});
