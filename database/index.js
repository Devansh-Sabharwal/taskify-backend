const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb+srv://Devansh:Devansh04@cluster0.r7oz5.mongodb.net/todoDB")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    name: String,
    email: {type:String,unique: true},
    password: String
});
const Todo = new Schema({
    userId: ObjectId,
    title: String,
    done: Boolean,
    timestamp: { type: Date, default: Date.now } // Automatically set timestamp to current date/time
});

const UserModel = mongoose.model('users',User);
const TodoModel = mongoose.model('todos',Todo);
module.exports = {
    UserModel: UserModel,
    TodoModel: TodoModel
}
