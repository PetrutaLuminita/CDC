const express = require('express');
const cors = require('cors');

const app = express()

app.use(express.static('public'));
app.use(cors());
app.get('/', (req, res) => {
  res.sendFile('./public/index.html', { root: __dirname });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});