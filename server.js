const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post('/api/order', (req, res) => {
  const { hole, items } = req.body;
  if (!hole || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  const orderId = Math.random().toString(36).slice(2, 10);
  res.json({ orderId });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
