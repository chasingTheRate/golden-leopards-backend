const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3001;

app.use(cors());

var apiRoutes = require('./routes/apiRoutes');

app.use(express.json());
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Golden Leopards App is live!`)
})