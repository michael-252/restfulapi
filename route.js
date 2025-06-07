const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { items } = require('../data');

// Validation helper
function validateItem(data) {
  const { name, description } = data;
  return name && description;
}

// GET all items
router.get('/', (req, res) => {
  res.json(items);
});

// GET item by ID
router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// POST create new item
router.post('/', (req, res) => {
  if (!validateItem(req.body)) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  const newItem = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT update item
router.put('/:id', (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  if (!validateItem(req.body)) {
    return res.status(400).json({ error: 'Name and description are required' });
  }

  items[index] = { id: req.params.id, ...req.body };
  res.json(items[index]);
});

// DELETE item
router.delete('/:id', (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  const deleted = items.splice(index, 1);
  res.json({ message: 'Item deleted', item: deleted[0] });
});

module.exports = router;
