const express = require('express');
const cors = require('cors');
require('dotenv').config();

const placesRouter = require('./routes/places');
const authRouter = require('./routes/auth');
//App initialization
const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
const PORT = process.env.PORT || 8090;

//Routes
app.use('/places', placesRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Local Loop is Up!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
