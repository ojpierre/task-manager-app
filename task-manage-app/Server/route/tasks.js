const express = require('express');
const router = express.Router();
const Task = require('../model/Task');

router.get('/:id', async (req, res) => {
  try {
    const tasks = await Task.findById(req.params.id);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  const newTask = new Task(req.body)
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
        res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    const message = `Task with ID ${id} deleted successfully.`;
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
