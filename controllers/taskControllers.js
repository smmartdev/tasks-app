const Task = require('../models/Task');

// Function to mark a task as completed
const markTaskAsComplete = async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, { isComplete: true });
    res.redirect('/');
};

// Function to mark all tasks as uncompleted
const markAllTasksAsUncompleted = async (req, res) => {
    const today = new Date().setHours(0, 0, 0, 0);
    await Task.updateMany({ user: req.user.id }, { $set: { isComplete: false } });
    res.redirect('/');
};

// Function to delete a task
const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
};


const getUserTasks = async (req, res) => {
    console.log('getUserTasks called');
    
    const tasks = Task.findOne({ user: req.user.id });
    res.render('index',{tasks});
};

// Export the functions
module.exports = {
    markTaskAsComplete,
    markAllTasksAsUncompleted,
    deleteTask,
    getUserTasks
};
