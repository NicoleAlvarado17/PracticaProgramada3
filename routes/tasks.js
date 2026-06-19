const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const router = express.Router();


// === INTENTO DE IMPLEMENTACIÓN DE TRANSACCIONES ACID  ===
// NOTA: Se deja comentado debido a que MongoDB Atlas M0 (Free) no soporta Replica Sets para transacciones.
/*
router.post('/transaction-test', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const newTask = new Task({ title: req.body.title, description: req.body.description });
        await newTask.save({ session });
        
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: "Transacción exitosa" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: "Error en la transacción" });
    }
});
*/



// READ: obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// CREATE: crear una tarea
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = new Task({ title, description, status });
    const savedTask = await task.save();

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear tarea' });
  }
});

// UPDATE: actualizar una tarea
router.put('/:id', async (req, res) => {
  console.log('PUT RECIBIÓ:', req.params.id);

  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar tarea' });
  }
});

// DELETE: eliminar una tarea
router.delete('/:id', async (req, res) => {
  console.log('DELETE RECIBIÓ:', req.params.id);

  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar tarea' });
  }
});

module.exports = router;
