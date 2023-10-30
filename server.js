const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const databaseFile = 'data.json';

// Retrieve items from the database
app.get('/api/items', (req, res) => {
  const data = fs.readFileSync(databaseFile);
  const items = JSON.parse(data);
  res.json(items);
});

// Add a new item to the database (data.json)
app.post('/api/items', (req, res) => {
  const data = fs.readFileSync(databaseFile);
  const items = JSON.parse(data);
  const newItem = {
    id: new Date().getTime().toString(),
    name: req.body.name
  };
  items.push(newItem);
  fs.writeFileSync(databaseFile, JSON.stringify(items, null, 2));
  res.json(newItem);
});

// Update an item in the database
app.put('/api/items/:id', (req, res) => {
  const data = fs.readFileSync(databaseFile);
  const items = JSON.parse(data);
  const itemId = req.params.id;
  const itemName = req.body.name;
  const itemIndex = items.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    items[itemIndex].name = itemName;
    fs.writeFileSync(databaseFile, JSON.stringify(items, null, 2));
    res.json(items[itemIndex]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Delete an item from the database
app.delete('/api/items/:id', (req, res) => {
  const data = fs.readFileSync(databaseFile);
  const items = JSON.parse(data);
  const itemId = req.params.id;
  
  const itemIndex = items.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    const deletedItem = items.splice(itemIndex, 1)[0];
    fs.writeFileSync(databaseFile, JSON.stringify(items, null, 2));
    res.json(deletedItem);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
