const { Router } = require("express");
const adminMiddleware = require("../middleware/user");
const { TodoModel } = require('../database/index');
const router = Router(); 

// todo Routes
router.post('/create', adminMiddleware, async (req, res) => {
    // Implement todo creation logic
    const userId = req.userId;
    try{
        await TodoModel.create({
            userId : userId,
            title: req.body.title,
            done: req.body.done
        })
        return res.send("Todo Created Successfully!!");
    }
    catch(err){
        return res.status(500).send("Error occurred while creating!! Please try again");
    }
    
});

router.put('/update/:id', adminMiddleware, async (req, res) => {
    // Implement update todo  logic
    const userId = req.userId;
    const todoId = req.params.id;
    const title = req.body.title;
    const done = req.body.done;
    try{
        const todo = await TodoModel.findById(todoId);
        if(!todo){
            return res.status(404).send("Todo Not Found!!");
        }
        todo.title = title;
        todo.done = done;
        await todo.save();
        res.status(200).send("Todo Updated Successfully!!");
    }catch(e){
        return res.status(500).send("Error occurred while updating!! Please try again");
    }

});

router.delete('/delete', adminMiddleware, async (req, res) => {
    // Implement delete todo logic
    const userId = req.userId;
    try {
        await TodoModel.deleteMany({ userId });
        return res.send("All Todos Deleted Successfully!!");
    } catch (err) {
        return res.status(500).send("Error occurred while deleting todos!! Please try again");
    }
});

router.delete('/delete/:id', adminMiddleware, async (req, res) => {
    // Implement delete todo by id logic
    const userId = req.userId;
    const todoId = req.params.id;
    try{
        const todo = await TodoModel.findByIdAndDelete(todoId);
        if(!todo){
            return res.status(404).send("Todo Not found");
        }
        res.send("Todo Deleted Successfully!!");
    }
    catch(e){
        res.status(404).send("Error while Deleting!!")
    }
});


router.get('/todos', adminMiddleware, async (req, res) => {
    // Implement fetching all todo logic
    const userId = req.userId;
    try {
        const todos = await TodoModel.find({ userId });
        return res.json(todos);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Error occurred while fetching todos!! Please try again");
    }
});

router.get('/todo/:id', adminMiddleware, async (req, res) => {
    const todoId = req.params.id;
    try {
        const todo = await TodoModel.findById(todoId);
        if (!todo) {
            return res.status(404).send("Todo Not Found!!");
        }
        return res.json(todo);
    } catch (err) {
        return res.status(500).send("Error occurred while fetching todo!! Please try again");
    }
});

module.exports = router;