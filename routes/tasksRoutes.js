const express = require('express');
const router = express.Router();

const {
    markTaskAsComplete,
    markAllTasksAsUncompleted,
    deleteTask,
    getUserTasks
} = require('../controllers/taskControllers'); // Adjust the path as necessary
const { isAuthenticated } = require('../middleware/auth');


// Task routes
router.post('/:id', isAuthenticated, getUserTasks);

router.post('/complete/:id', isAuthenticated, markTaskAsComplete);
router.post('/uncomplete-all', isAuthenticated, markAllTasksAsUncompleted);
router.post('/delete/:id', isAuthenticated, deleteTask);

module.exports = router;
