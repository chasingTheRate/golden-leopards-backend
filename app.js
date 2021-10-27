const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000

app.use(cors());

var apiRoutes = require('./routes/apiRoutes');

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})