const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const todoRoutes = require('./routes/todo');
const userRoutes = require('./routes/user');
dotenv.config();

const app = express();
const port = process.env.port;
app.use(cors());  
console.log(port);

app.use(express.json());

app.get("/healthy", (req, res)=> res.send("I am Healthy"));

app.use(userRoutes);
app.use(todoRoutes);
app.listen(port, ()=> console.log(`server is running at http://localhost:${port}`));